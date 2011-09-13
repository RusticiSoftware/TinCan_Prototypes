/*jslint node: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
var methods, collectionNames, actorUniqueProps;
methods = {
	statements: '/tcapi/statements'
};

actorUniqueProps = ['mbox'];
collectionNames = ['statements', 'actors', 'activities'];


/*!
ruuid() is an Excerpt from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

function ruuid() {
	"use strict";
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { 
		/*jslint bitwise: true*/
		var r = Math.random() * 16 | 0,
			v = c === 'x' ? r : (r & 0x3 | 0x8); 
		/*jslint bitwise: false*/
		return v.toString(16);
	});
}

function checkError(error, request, response, text) {
	"use strict";
	var errString;
	if (error !== null && error !== undefined) {
		errString = 'ERROR: ' + request.method + " : " + request.url + " (" + text + ") \n" + error.stack;
		console.error(errString);
		response.writeHead(500);
		response.end(errString);
		return false;
	}
	return true;
}

function parseJSONRequest(request, callback) {
	"use strict";
	var result, error, data;
	data = '';
	error = null;

	request.on('data', function (chunk) {
		data += chunk.toString('ascii');
	});

	request.on('end', function () {
		try {
			result = JSON.parse(data);
		} catch (ex) {
			error = ex;
		}
		callback(error, result);
	});
}


// merges source into target, returns true if target is updated.
// exception if source and target contain contradictary information
function mergeActivities(source, target) {
	"use strict";
	var modified, property;
	modified = false;
	
	for (property in source) {
		if (target[property] === undefined) {
			target[property] = source[property];
			modified = true;
		} else if (target[property] !== source[property] && JSON.stringify(target[property]) !== JSON.stringify(source[property])) {
			throw new Error('Activity : "' + source.id + '", conflicting values of: ' + property);
		}
	}
	 
	return modified;
}


// store activity
function storeActivities(activities, collections, callback) {
	"use strict";
	var ii, uniqueActivities, uniqueActivityIDs, activity, updates;
	
	uniqueActivities = {};
	uniqueActivityIDs = [];
	
	for (ii = 0; ii < activities.length; ii++) {
		if (activities[ii] !== undefined) {
			activity = activities[ii];
			
			// it's possible to have multiple references to the same activity in a set of statements, get unique list
			if (uniqueActivities[activity.id] === undefined) {
				uniqueActivities[activity.id] = activity;
				uniqueActivityIDs.push(activity.id);
			} else {
				mergeActivities(activity, uniqueActivities[activity.id]);
			}
		}
	}
	
	collections.activities.find({ id : { $in : uniqueActivityIDs } }).toArray(function (error, dbActivities) {
		var member, modified, dbActivityMap, id;
		
		updates = [];
		
		if (error !== null){
			console.error(error);
			callback(error);
		} else {
			dbActivityMap = {};
			for ( ii = 0 ; ii < dbActivities.length ; ii++){
				dbActivityMap[dbActivities[ii].id] = dbActivities[ii];
			}
		
			for ( ii = 0 ; ii < uniqueActivityIDs.length; ii++){
				id = uniqueActivityIDs[ii];
				if (dbActivityMap[id] === undefined) {
					updates.push(uniqueActivities[id]);
				} else if (mergeActivities(uniqueActivities[id],dbActivityMap[id])) {
					updates.push(dbActivityMap[id]);
				}
			}
			
			if (updates.length > 0) {
				require('async').map(updates, function (update, callback) {
					collections.activities.insert(update, { safe : true},  callback);
				}, callback);
			}
			else {
				callback();
			}
		}
	});
}

// store actors (authority, "object")
function storeActors(actors, collections, callback) {
	"use strict";
	var definedActors, ii, jj, hasUniqueProp;
	
	definedActors = [];
	for (ii = 0; ii < actors.length; ii++) {
		if (actors[ii] !== undefined) {
			hasUniqueProp = false;
			
			for (jj = 0; jj < actorUniqueProps.length; jj++) {
				if (actors[ii][actorUniqueProps[jj]] !== undefined) {
					hasUniqueProp = true;
					break;
				}
			}
			if (!hasUniqueProp) {
				callback(new Error('Actor has no members which have the inverse functional property (actor is not uniquely identified): ' + JSON.stringify(actors[ii])));
				return;
			}
			definedActors.push(actors[ii]);
		}
	}
	
	callback();
	//collections.actors.save(definedActors, { safe : true }, callback);
}


/*
accepts object consisting of either a statement, or an array of statements
validates and stores statements, calls back with error, array of IDs
*/
function storeStatements(statements, collections, callback) {
	"use strict";
	var actors, activities, ii, async, statement, context;

	async = require('async');
	actors = [];
	activities = [];
	
	// statements are stored in their entierty as sent, but actors and activities used in the statement
	// also need to be stored/updated -- extracting those from activities
	for (ii = 0; ii < statements.length; ii++) {
		statement = statements[ii];

		actors.push(statement.authority, statement.actor);
		if (statement.context !== undefined) {
			context = statement.context;
			actors.push(context.instructor, context.team);
			activities.push(context.activity);
		}
		if (statement.verb === 'mentored' || statement.verb === 'mentored by'){
			actors.push(statement.object);
		} else {
			activities.push(statement.object);
		}
		
	}
	
	async.parallel([
		function(callback){ collections.statements.insert(statements, { safe: true }, callback); },
		function(callback){ storeActors(actors, collections, callback); },
    	function(callback){ storeActivities(activities, collections, callback); }
	],callback);
}

function isAuthorized(request) {
	"use strict";
	// expect: user: test, password: password
	return request.headers.authorization === 'Basic dGVzdDpwYXNzd29yZA==';
}

function getAuthenticatedUser(request) {
	"use strict";
	// only test user can authenticate, so...
	return { 'mbox' : 'mailto:test.user@example.scorm.com' };
}


function hasAllProperties(object, properties, name) {
	var missing, ii, msg;
	missing = [];
	
	for (ii = 0; ii < properties.length; ii++) {
		if (object[properties[ii]] === undefined) {
			missing.push(properties[ii]);
		}
	}
	
	if (missing.length > 0) {
		msg = name + ' missing required properties: ' + missing.join(',');
		console.log(msg);
		
		return msg;
	} else {
		return '';
	}
	
}


/*
verifies statement is valid
returns true if valid, otherwise false
*/
function isValidStatement(statement, request) {
	"use strict";
	if (statement.authority.mbox !== getAuthenticatedUser(request).mbox) {
		return 'Authentication Failed.';
	}

	return hasAllProperties(statement, ['verb','object'], 'statement');
}

/*
prepares a statement for storage, assigns properties LRS is responsible for,
or is responsible for if not set
*/
function prepareStatement(statement, request) {
	"use strict";

	if (statement.authority === undefined) {
		statement.authority =  getAuthenticatedUser(request);
	}
	if (statement.actor === undefined) {
		statement.actor =  statement.authority;
	}
	
	statement.stored = new Date();
	
	// db layer uses _id for primary key
	if (statement.id !== undefined) {
		statement._id = statement.id;
		delete statement.id;
	} else {
		statement._id = ruuid();
	}
}

function handleStatementGetRequest(request, response, collections) {
	"use strict";
	var query, ii;
	
	query = {};
	
	if (request.url.length > (methods.statements.length + 1)) {
		query._id = request.url.substring(methods.statements.length + 1);
	}

	collections.statements.find(query).toArray( function(error, results) {
		if (error !== null) {
			checkError(error, request, response, 'handleStatementGetRequest_find');
		} else {
			// db uses _id for primary key, spec expects id
			for (ii = 0; ii < results.length; ii++) {
				results[ii].id = results[ii]._id;
				delete results[ii]._id;
			}
		
			if (results.length === 1) {
				results = results[0];
			}
			response.end(JSON.stringify(results, null, 4));
		}
	});
}


function handleStatementRequest(request, response, collections) {
	"use strict";
	var responseText, ii;

	parseJSONRequest(request, function (error, data) {
		var validationError;
		if (checkError(error, request, response, "parsing request body")) {

			if (request.method === 'PUT') {
				data._id = request.url.substring(methods.statements.length + 1);
				prepareStatement(data, request);
				validationError = isValidStatement(data, request);
				if (validationError === '') {
					storeStatements(data, collections, function (error) {
						if (checkError(error, request, response, "storing statements")) {
							response.statusCode = 204;
							response.end('');
						}
					});
				} else {
					response.statusCode = 400;
					response.end(validationError);
				}
			} else if (request.method === 'POST') {
				// treat a single statement as a list of 1 statements
				if (!(data instanceof Array)) {
					data = [data];
				}
				
				// prepare and validate individual statements
				for (ii = 0; ii < data.length; ii++) {
					prepareStatement(data[ii], request);
					validationError = isValidStatement(data[ii], request);
					if (validationError !== '') {
						response.statusCode = 400;
						response.end(validationError);
						return;
					}
				}
				
				// store statements as a set
				storeStatements(data, collections, function (error) {
					if (checkError(error, request, response, "storing statements")) {
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


function handleRequest(request, response, db) {
	"use strict";

	response.setHeader('Content-Type', 'text/plain');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'PUT');
	response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	try {
		if (request.method === 'OPTIONS') {
			response.end();
		} else if (!isAuthorized(request)) {
			response.statusCode = 401;
			response.setHeader('WWW-Authenticate', 'Basic realm="LRS demo"');
			response.end();
		} else if (request.url.toLowerCase().indexOf(methods.statements) === 0 && (request.method === 'GET')) {
			console.log(request.method + ' ' + request.url);
			handleStatementGetRequest(request, response, db);
		} else if (request.url.toLowerCase().indexOf(methods.statements) === 0 && (request.method === 'PUT' || request.method === 'POST')) {
			console.log(request.method + ' ' + request.url);
			handleStatementRequest(request, response, db);
		} else {
			console.error('Unexpected request: ' + request.method + " : " + request.url);
			response.statusCode = 405;
			response.end();
		}
	} catch (ex) {
		checkError(ex, request, response, 'handleRequest');
	}
}


function main() {
	"use strict";
	var http, mongodb, mongoserver, db, async;
	http = require('http');
	async = require('async');


	mongodb = require('mongodb');
	mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT);
	db = new mongodb.Db('local', mongoserver);
	db.open(function (err, db) {
		if (err === null) {
			console.log("DB 'local' Initialized");
			async.map(collectionNames, function (collectionName, callback) {
				db.collection(collectionName, callback);

			}, function (err, collectionsArray) {
				var ii, server, collections;
				collections = {};

				if (err !== null && err !== undefined) {
					console.log("error: " + err);
					throw err;
				}

				for (ii = 0; ii < collectionsArray.length; ii++) {
					//collectionsArray[ii].remove({});
					collections[collectionsArray[ii].collectionName] = collectionsArray[ii];
				}

				server = http.createServer(function (request, response) {
					handleRequest(request, response, collections);
				});
				server.listen(8080, "127.0.0.1");
			});
		} else
		{
			throw err;
		}
	});
}

main();