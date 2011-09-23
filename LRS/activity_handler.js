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
	if (parts[1] === 'state' && (parts.length === 4 || (parts.length === 3 && request.method === 'DELETE'))) {
		//state API: PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>/<State ID>
		key = parseStateRequest(parts);
		requestContext.storage.handleKVPRequest(requestContext, key, collections.state);
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleActivityRequest;