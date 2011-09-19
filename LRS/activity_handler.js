/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async;
method = '/tcapi/activities';
util = require('./util.js');
async = require('async');

function handleStateRequest(requestContext, methodParts) {
	"use strict";
	var key, method, response;
	method = requestContext.request.method;
	response = requestContext.response;

	key = { activity : decodeURIComponent(methodParts[0]),
			actor : decodeURIComponent(methodParts[2]),
			state : decodeURIComponent(methodParts[3]) };

	if (method === 'PUT') {
		util.loadRequestBody(requestContext.request, function (error, data) {
			if (error !== null) {
				throw error;
			}
			requestContext.storage.collections.state.save({_id : key, data : data}, { safe : true }, function (error) {
				if (util.checkError(error, requestContext.request, response, "storing state")) {
					response.statusCode = 204;
					response.end('');
				}
			});
		});
	} else if (method === 'DELETE') {
		requestContext.storage.collections.state.remove({_id : key}, { safe : true }, function (error) {
			if (util.checkError(error, requestContext.request, response, "clearing state")) {
				response.statusCode = 204;
				response.end('');
			}
		});
	} else {
		// then get
		requestContext.storage.collections.state.find({_id : key}).toArray(function (error, result) {
			if (util.checkError(error, requestContext.request, response, "loading state")) {
				response.statusCode = 200;
				response.end(result[0].data);
			}
		});
	}
}

function handleActivityRequest(requestContext) {
	"use strict";
	var request, parts;
	request = requestContext.request;

	if (request.method !== 'PUT' && request.method !== 'GET' && request.method !== 'DELETE') {
		return false;
	}

	if (request.url.toLowerCase().indexOf(method) !== 0) {
		return false;
	}
	parts = request.url.toLowerCase().substring(method.length + 1).split('/');
	if (parts[1] === 'state' && parts.length === 4) {
		//state API: PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>/<State ID>
		handleStateRequest(requestContext, parts);
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleActivityRequest;