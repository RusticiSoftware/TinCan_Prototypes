/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, method, util, async;
method = '/tcapi/actors';
util = require('./util.js');
async = require('async');


function handleActorRequest(requestContext) {
	"use strict";
	var request, response, parts, collections, actor;
	request = requestContext.request;
	response = requestContext.response;
	collections = requestContext.storage.collections;

	if (requestContext.path.toLowerCase().indexOf(method) !== 0) {
		return false;
	}
	parts = requestContext.path.toLowerCase().substring(method.length + 1).split('/');
	if (request.method === 'GET' && (parts.length === 1 || (parts.length === 2 && parts[1] === ""))) {
		// get actor definition
		actor = JSON.parse(decodeURIComponent(parts[0]));
		requestContext.storage.findActorMatches([actor], function (error, results) {
			if (util.checkError(error, requestContext.request, response, "GET actor definition")) {
				if (results.length === 0) {
					response.statusCode = 404;
					console.log('Could not find actor: ' + JSON.stringify(actor, null, 4));
				} else if (results.length === 1) {
					response.write(JSON.stringify(results[0], null, 4));
				} else {
					response.statusCode = 500;
					response.write('Unexpected actor count: ' + JSON.stringify(results, null, 4));
				}
				response.end();
			}
		});
		return true;
	} else {
		return false;
	}
}

exports.handleRequest = handleActorRequest;