/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async, verbs, config;
method = '/tcapi/statements';
util = require('./util.js');
config = require('./config.js');
async = require('async');

verbs = ["experienced", "read", "watched", "witnessed", "studied", "reviewed", "learned", "attended",
	"heard", "attempted", "performed", "played", "simulated", "completed", "passed", "mastered",
	"failed", "answered", "interacted", "drove", "piloted", "used", "achieved", "participated",
	"mentored", "mentored by", "commented", "asked", "created", "authored", "wrote", "edited",
	"blogged", "shared", "posted", "taught", "imported"];

/*
verifies statement is valid
returns true if valid, otherwise false
*/
function isValidStatement(statement, request) {
	"use strict";
	if (statement.authority !== undefined && statement.authority.mbox !== util.getAuthenticatedUser(request).mbox) {
		return 'Authentication Failed.';
	}
	if (!util.inList(statement.verb, verbs)) {
		return 'Unexpected verb: "' + statement.verb + '"';
	}

	return util.hasAllProperties(statement, ['verb', 'object'], 'statement');
}

/*
prepares a statement for storage, assigns properties LRS is responsible for,
or is responsible for if not set
*/
function prepareStatement(statement, request) {
	"use strict";

	if (statement.authority === undefined) {
		statement.authority =  util.getAuthenticatedUser(request);
	}
	if (statement.actor === undefined) {
		statement.actor =  statement.authority;
	}

	if (statement.verb !== undefined) {
		statement.verb = statement.verb.toLowerCase();
	}
	statement.stored = new Date();

	if (util.inList(statement.verb, ['passed', 'failed', 'completed'])) {
		if (statement.result === undefined) {
			statement.result = {};
		}
		statement.result.completion = true;
		if (statement.verb === 'passed') {
			statement.result.success = true;
		}
		if (statement.verb === 'failed') {
			statement.result.success = false;
		}
	}

	// db layer uses _id for primary key
	if (statement.id !== undefined) {
		statement._id = statement.id;
		delete statement.id;
	} else {
		statement._id = util.ruuid();
	}
}

/*
accepts object consisting of either a statement, or an array of statements
validates and stores statements, calls back with error, array of IDs
*/
function processStatements(postedStatements, storage, request, callback) {
	"use strict";
	var actors, activities, statement, processedStatements, context, ii, error, validationError, statements;

	actors = [];
	activities = [];
	processedStatements = [];
	statements = [];

	for (ii = 0; ii < postedStatements.length; ii++) {
		validationError = isValidStatement(postedStatements[ii], request);
		if (validationError !== '') {
			error = new Error(validationError);
			error.HTTPStatus = 400;
			callback(error);
			return;
		}
		// copy while validating, to avoid modifying the contents of the array of posted statemets passed in
		statements.push(postedStatements[ii]);
	}

	// statements are stored in their entierty as sent, but actors and activities used in the statement
	// also need to be stored/updated -- extracting those from activities
	while (statements.length > 0) {
		statement = statements.pop();

		if (statement.context !== undefined) {
			context = statement.context;
			if (statement.context.statement !== undefined) {
				statements.push(statement.context.statement);
				// don't store the entire context statement, if provided, with this statement, just the ID -- particularly 
				// since when storing statements in the DB they will be transformed, but the context reference should not be.
				statement.context.statement = {id : statement.context.statement.id};
			}
		}

		prepareStatement(statement, request);

		util.addStatementActivities(statement, activities);
		util.addStatementActors(statement, actors);

		// only context statements can have reached this point without an object, and lack of an object makes an incomplete statement
		// since the statement is incomplete, it can't be stored (since statements are immutable, it can't be completed later).
		// we have to assume it is a reference to a statement that either has already been stored in this system,
		// or is stored in another system, and silently not store it.
		if (statement.object !== undefined) {
			processedStatements.push(statement);
		}
	}

	// actors must be stored before statements to determine surrogate actor key to associate with statements
	storage.storeActors(actors, function (error) {
		if (error !== null && error !== undefined) {
			callback(error);
			return;
		}
		async.parallel([
			function (callback) { storage.storeProcessedStatements(processedStatements, callback); },
			function (callback) { storage.storeActivities(activities, callback); }
		], callback);
	});
}

function validateId(id, response) {
	"use strict";
	if (!id.match(/^\{?[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}\}?$/)) {
		response.statusCode = 400;
		response.end('Bad ID: "' + id + '", expected UUID as 32 hex digits, optionally grouped 8-4-4-4-12 with hyphens.');
		return false;
	}
	return true;
}

function handleStatementGetRequest(requestContext) {
	"use strict";
	var query, limit, request, methodDetail, parameters, sparse, offset;

	request = requestContext.request;
	limit = 50;
	offset = 0;
	sparse = true;
	query = {};
	parameters = {};

	if (requestContext.path.length > method.length + 1) {
		methodDetail = requestContext.path.substring(method.length);
		if ('/' !== methodDetail.charAt(0)) {
			return false;
		}
		methodDetail = methodDetail.substring(1);

		parameters = { id : methodDetail };
		if (!validateId(parameters.id, requestContext.response)) {
			return true;
		}

		sparse = false;
	} else if (requestContext.queryString !== {}) {
		parameters = requestContext.queryString;
		util.parseProps(parameters);
		if (parameters.limit !== undefined) {
			limit = parseInt(parameters.limit, 10);
		}
		if (parameters.offset !== undefined) {
			offset = parseInt(parameters.offset, 10);
		}
		if (parameters.sparse !== undefined) {
			sparse = util.toBool('sparse', parameters.sparse);
		}
	}

	requestContext.storage.buildStatementQuery(parameters, function (error, query) {
		if (!util.checkError(error, request, requestContext.response)) {
			return;
		}
		requestContext.storage.collections.statements.find(query).sort({ stored : -1 }).skip(offset).limit(limit).toArray(function (error, results) {
			if (util.checkError(error, request, requestContext.response, 'handleStatementGetRequest_find')) {
				if (results.length === 0 && query._id !== undefined) {
					requestContext.response.statusCode = 404;
					requestContext.response.end();
				} else {
					if (config.verbose) {
						console.log(results.length + ' statements returned.');
					}
					requestContext.storage.normalizeStatements(results, sparse, function (error) {
						if (util.checkError(error, requestContext.request, requestContext.response, "handleStatementGetRequest_prepare")) {
							// single statements should be returned as a document, not an array
							if (query._id !== undefined) {
								results = results[0];
							}

							requestContext.response.end(JSON.stringify(results, null, 4));
						}
					});
				}
			}
		});
	});
	return true;
}

function handleStatementSetRequest(requestContext) {
	"use strict";
	var ii, request, response, id;

	request = requestContext.request;
	response = requestContext.response;

	if (request.method === 'PUT') {
		id = requestContext.path.substring(method.length + 1);
		if (!validateId(id, requestContext.response)) {
			return true;
		}
	}

	util.parseJSONRequest(request, function (error, data) {
		//console.log('data: ' + JSON.stringify(data, null, 4));
		if (util.checkError(error, request, response, "parsing request body")) {
			if (request.method === 'PUT') {
				data.id = id;
				// wrap statement in an array since processStatements expects multiple statements
				processStatements([data], requestContext.storage, request, function (error) {
					if (util.checkError(error, request, response, "storing statements")) {
						response.statusCode = 204;
						response.end('');
					}
				});
			} else if (request.method === 'POST') {
				// treat a single statement as a list of 1 statements
				if (!(data instanceof Array)) {
					data = [data];
				}
				// process/store statements as a set
				processStatements(data, requestContext.storage, request, function (error) {
					var ids = [];

					if (util.checkError(error, request, response, "storing statements")) {
						response.statusCode = 200;
						for (ii = 0; ii < data.length; ii++) {
							ids.push(data[ii]._id);
						}
						response.end(JSON.stringify(ids, null, 4));
					}
				});
			} else {
				util.checkError(new Error("unexpected statement request"), request, response);
			}
		}
	});
	return true;
}

exports.handleRequest = function (requestContext) {
	"use strict";
	var request = requestContext.request;

	if (requestContext.path.toLowerCase().indexOf(method) !== 0) {
		return false; // not a statement request
	}

	util.loadRequestBody(request, function (error, body) {
		var handled = false;
		if (util.checkError(error, request, requestContext.response)) {
			if (request.method === 'GET') {
				handled = handleStatementGetRequest(requestContext);
			} else if (request.method === 'POST' && body.length > 0 && !body.match(/^\s*[\[{]/)) {
				/* logical "GET" requests may use a post if necessary to work around URL limit lengths.
				the body of such requests would not be JSON (and therefore not start with { or [, 
				but the body would exist, as if there were no querystring parameters to pass the querystring would not
				generate a long URL, and the GET method could be used. */

				requestContext.queryString = require('querystring').parse(body);

				handled = handleStatementGetRequest(requestContext);
			} else if (request.method === 'PUT' || (request.method === 'POST' && requestContext.path.length <= (method.length + 1))) {
				handled = handleStatementSetRequest(requestContext);
			}
		}

		if (!handled) {
			util.unexpectedRequest(request, requestContext.response);
		}
	});

	return true;
};