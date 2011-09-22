/*jslint node: true, regexp: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, util, async;
util = require('./util.js');
async = require('async');

function parseProfileRequest(parts, requestContext, callback) {
	"use strict";
	var operation, key, actor;

	operation = {};
	key = operation.key = {};
	operation.method = requestContext.request.method;
	operation.collection = parts[1].toLowerCase() === 'activities' ? requestContext.storage.collections.activity_profile : requestContext.storage.collections.actor_profile;
	key.key = decodeURIComponent(parts[3]);

	if (parts[1].toLowerCase() === 'actors') {
		actor = JSON.parse(decodeURIComponent(parts[2]));
		requestContext.storage.getActorId(actor, function (error, id) {
			if (error !== null && error !== undefined) {
				callback(error);
				return;
			}
			key.actor = id;
			callback(null, operation);
		});
	} else { // activities
		key.activity = decodeURIComponent(parts[2]);
		callback(null, operation);
	}
}

function handleProfile(requestContext) {
	"use strict";
	var request, parts, collections;
	request = requestContext.request;
	collections = requestContext.storage.collections;

	if (request.method !== 'PUT' && request.method !== 'GET' && request.method !== 'DELETE') {
		return false;
	}

	//actor/activity profile
	parts = /tcapi\/(actors|activities)\/([^\/]+)\/profile\/([^\/]+)\/?/i.exec(request.url);

	if (parts === null) {
		return false;
	} else {

		parseProfileRequest(parts, requestContext, function (error, operation) {
			if (util.checkError(error, request, requestContext.response)) {
				requestContext.storage.handleKVPRequest(requestContext, operation.key, operation.collection);
			}
		});
		return true;
	}
}

exports.handleProfile = handleProfile;