/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async;
method = '/tcapi/activities';
util = require('./util.js');
async = require('async');


function parseStateRequest(methodParts) {
	"use strict";
	var key = {};

	key.activity = decodeURIComponent(methodParts[0]);
	key.actor = JSON.parse(decodeURIComponent(methodParts[2]));
	if (methodParts.length > 3) {
		key.stateId = decodeURIComponent(methodParts[3]);
	}

	return key;
}

function parseActivityProfile(methodParts) {
	"use strict";
	var key = {};

	key.activity = decodeURIComponent(methodParts[0]);
	if (methodParts.length > 2) {
		key.stateId = decodeURIComponent(methodParts[2]);
	}

	return key;
}

function handleStateRequest(requestContext, key, collection) {
	"use strict";
	var method, response;
	method = requestContext.request.method;
	response = requestContext.response;

	if (method === 'PUT') {
		util.loadRequestBody(requestContext.request, function (error, data) {
			if (error !== null) {
				throw error;
			}
			collection.save({_id : key, data : data}, { safe : true }, function (error) {
				if (util.checkError(error, requestContext.request, response, "storing state")) {
					response.statusCode = 204;
					response.end('');
				}
			});
		});
	} else if (method === 'DELETE') {
		collection.remove({_id : key}, { safe : true }, function (error) {
			if (util.checkError(error, requestContext.request, response, "clearing state")) {
				response.statusCode = 204;
				response.end('');
			}
		});
	} else {
		// then get
		collection.find({_id : key}).toArray(function (error, result) {
			if (util.checkError(error, requestContext.request, response, "loading state")) {
				switch (result.length) {
				case 0:
					response.statusCode = 404;
					response.end();
					break;
				case 1:
					response.statusCode = 200;
					response.end(result[0].data);
					break;
				default:
					util.checkError(new Error('Found too many state objects'), requestContext.request, response, "loading state");
					break;
				}
			}
		});
	}
}

function clearState(requestContext, key, collection) {
	"use strict";
	var response, query;
	response = requestContext.response;

	query = {$and : [ {"_id.activity" : key.activity}, {"_id.actor" : key.actor}]};
	//query = {'_id.actor' : key.actor};

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
	var request, parts, key, collections;
	request = requestContext.request;
	collections = requestContext.storage.collections;

	if (request.method !== 'PUT' && request.method !== 'GET' && request.method !== 'DELETE') {
		return false;
	}

	if (request.url.toLowerCase().indexOf(method) !== 0) {
		return false;
	}
	parts = request.url.toLowerCase().substring(method.length + 1).split('/');
	if (parts[1] === 'state' && parts.length === 4) {
		//state API: PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>/<State ID>
		key = parseStateRequest(parts);
		handleStateRequest(requestContext, key, collections.state);
		return true;
	} else if (parts[1] === 'state' && parts.length === 3 && request.method === 'DELETE') {
		// state API -- clear all state for this activity + actor
		key = parseStateRequest(parts);
		clearState(requestContext, key, collections.state);
		return true;
	} else if (parts[1] === 'profile' && parts.length === 3) {
		// activity profile API: PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/profile/<profile object key>
		key = parseActivityProfile(parts);
		handleStateRequest(requestContext, key, collections.activity_profile);
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleActivityRequest;