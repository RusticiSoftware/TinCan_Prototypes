/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async;
method = '/tcapi/activities';
util = require('./util.js');
async = require('async');


function parseStateRequest(storage, methodParts, callback) {
	"use strict";
	var key = {};

	key.activity = decodeURIComponent(methodParts[0]);
	key.actor = JSON.parse(decodeURIComponent(methodParts[2]));
	if (methodParts.length > 3) {
		key.key = decodeURIComponent(methodParts[3]);
	}

	storage.getActorID(key.actor, function (error, actorId) {
		key.actor = actorId;
		callback(error, key);
	});
}

function clearState(requestContext, key, collection) {
	"use strict";
	var response, query;
	response = requestContext.response;

	query = {"_id.activity" : key.activity, "_id.actor" : key.actor };

	collection.remove(query, { safe : true }, function (error) {
		error = new Error("doesn't work yet");
		if (util.checkError(error, requestContext.request, response, "clearing state")) {
			response.statusCode = 204;
			response.end('');
		}
	});
}

function handleActivityRequest(requestContext) {
	"use strict";
	var request, response, parts, collections, qsParameters;
	request = requestContext.request;
	response = requestContext.response;
	collections = requestContext.storage.collections;

	if (request.method !== 'PUT' && request.method !== 'GET' && request.method !== 'DELETE') {
		return false;
	}

	if (requestContext.path.toLowerCase().indexOf(method) !== 0) {
		return false;
	}
	parts = requestContext.path.toLowerCase().substring(method.length + 1).split('/');
	if (parts[1] === 'state' && (parts.length === 4 || (parts.length === 3 && (request.method === 'DELETE' || request.method === 'GET')))) {
		//state API: PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>/<State ID>
		parseStateRequest(requestContext.storage, parts, function (error, key) {
			// always use provided registration (even undefined -- only select state with no defined registration in that case)
			key.registration = requestContext.queryString.registration;
			if (util.checkError(error, requestContext.request, response, "parse state request")) {
				requestContext.storage.handleKVPRequest(requestContext, key, parts.length === 3, collections.state);
			}
		});
		return true;
	} else if (request.method === 'GET' && (parts.length === 1 || (parts.length === 2 && parts[1] === ""))) {
		// get activity definition
		collections.activities.find({ id : decodeURIComponent(parts[0])}).toArray(function (error, result) {
			if (util.checkError(error, requestContext.request, response, "GET activity definition")) {
				if (result.length === 0) {
					response.statusCode = 404;
				} else if (result.length === 1) {
					response.write(JSON.stringify(result[0], null, 4));
				} else {
					response.statusCode = 500;
					response.write('Unexpected activity count: ' + JSON.stringify(result, null, 4));
				}
				response.end();
			}
		});
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleActivityRequest;