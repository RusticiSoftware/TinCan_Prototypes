/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async;
method = '/tcapi/statements';
util = require('./util.js');
async = require('async');

/*
verifies statement is valid
returns true if valid, otherwise false
*/
function isValidStatement(statement, request) {
	"use strict";
	if (statement.authority !== undefined && statement.authority.mbox !== util.getAuthenticatedUser(request).mbox) {
		return 'Authentication Failed.';
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
function processStatements(statements, storage, request, callback) {
	"use strict";
	var actors, activities, statement, processedStatements, context, ii, error, validationError;

	actors = [];
	activities = [];
	processedStatements = [];

	for (ii = 0; ii < statements.length; ii++) {
		validationError = isValidStatement(statements[ii], request);
		if (validationError !== '') {
			error = new Error(validationError);
			error.HTTPstatus = 400;
			callback(error);
			return;
		}
	}

	// statements are stored in their entierty as sent, but actors and activities used in the statement
	// also need to be stored/updated -- extracting those from activities
	while (statements.length > 0) {
		statement = statements.pop();

		util.addStatementActivities(statement, activities);
		util.addStatementActors(statement, actors);

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

		// only context statements can have reached this point without an object, and lack of an object makes an incomplete statement
		// since the statement is incomplete, it can't be stored (since statements are immutable, it can't be completed later).
		// we have to assume it is a reference to a statement that either has already been stored in this system,
		// or is stored in another system, and silently not store it.
		if (statement.object !== undefined) {
			processedStatements.push(statement);
		}
	}

	async.parallel([
		function (callback) { storage.storeProcessedStatements(processedStatements, callback); },
		function (callback) { storage.storeActors(actors, callback); },
		function (callback) { storage.storeActivities(activities, callback); }
	], callback);
}

function handleStatementGetRequest(requestContext) {
	"use strict";
	var query, limit, request, methodDetail, parameters, sparse;

	request = requestContext.request;
	limit = 0;
	sparse = true;
	query = {};

	if (request.url.length > method.length) {
		methodDetail = request.url.substring(method.length);

		// statements?query or statements/?query are both valid, 
		if ('/' === methodDetail.charAt(0)) {
			methodDetail = methodDetail.substring(1);
		} else if ('?' !== methodDetail.charAt(0)) {
			util.checkError(new Error('Invalid request, expected "?" or "/" after statements'), request, requestContext.response, 'handleStatementGetRequest');
		}

		if (methodDetail.indexOf('/') >= 0) {
			util.checkError(new Error('Invalid request, "/" not expected in method detail'), request, requestContext.response, 'handleStatementGetRequest');
		}

		if (methodDetail.charAt(0) === '?') {
			parameters = require('querystring').parse(methodDetail.substring(1));
			if (parameters.limit !== undefined) {
				limit = parameters.limit;
			}
			if (parameters.sparse !== undefined) {
				sparse = util.toBool('sparse', parameters.sparse);
			}

			query = requestContext.storage.buildStatementQuery(parameters);
		} else if (methodDetail.length > 0) {
			sparse = false;
			query = {'_id' : methodDetail};
		}
	}

	//console.log('query: ' + JSON.stringify(query, null, 4));

	requestContext.storage.collections.statements.find(query).sort({ stored : -1 }).limit(parseInt(limit, 10)).toArray(function (error, results) {
		if (util.checkError(error, request, requestContext.response, 'handleStatementGetRequest_find')) {
			if (results.length === 0 && query._id !== undefined) {
				requestContext.response.statusCode = 404;
				requestContext.response.end();
			} else {
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
}

function handleStatementSetRequest(requestContext) {
	"use strict";
	var responseText, ii, request, response;

	request = requestContext.request;
	response = requestContext.response;

	util.parseJSONRequest(request, function (error, data) {
		//console.log('data: ' + JSON.stringify(data, null, 4));
		if (util.checkError(error, request, response, "parsing request body")) {
			if (request.method === 'PUT') {
				data._id = request.url.substring(method.length + 1);
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
					if (util.checkError(error, request, response, "storing statements")) {
						response.statusCode = 200;
						responseText = "";
						for (ii = 0; ii < data.length; ii++) {
							responseText += data[ii]._id + "\n";
						}

						response.end(responseText);
					}
				});
			} else {
				throw "unexpected statement request";
			}
		}
	});
}

function handleStatementRequest(requestContext) {
	"use strict";
	var request;
	request = requestContext.request;

	if (request.url.toLowerCase().indexOf(method) === 0 && (request.method === 'GET')) {
		handleStatementGetRequest(requestContext);
		return true;
	} else if (request.url.toLowerCase().indexOf(method) === 0 && (request.method === 'PUT' || request.method === 'POST')) {
		handleStatementSetRequest(requestContext);
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleStatementRequest;