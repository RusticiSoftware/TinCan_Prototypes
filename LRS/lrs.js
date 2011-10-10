/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
var methods, actorUniqueProps, async, http, mongodb, requestHandlers, storage, util, config;

async = require('async');
http = require('http');
storage = require('./storage.js');
config = require('./config.js');

requestHandlers = [require('./statement_handler.js').handleRequest,
	require('./activity_handler.js').handleRequest,
	require('./profile_handler.js').handleProfile,
	require('./actor_handler.js').handleRequest,
	storage.dropDBHandler];
util = require('./util.js');

function handleRequest(request, response, storage) {
	"use strict";
	var handled, ii, requestContext, urlParts, path,
		queryString = {};

	response.setHeader('Content-Type', 'text/plain');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE');
	response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	try {
		util.storeRequestBody(request);
		if (request.method === 'OPTIONS') {
			response.end();
		} else if (!util.isAuthorized(request)) {
			response.statusCode = 401;
			response.setHeader('WWW-Authenticate', 'Basic realm="LRS demo"');
			response.end();
		} else {
			handled = false;
			urlParts = request.url.split('?');
			path = urlParts[0];
			if (urlParts.length === 2) {
				queryString = require('querystring').parse(urlParts[1]);
			} else if (urlParts.length > 2) {
				console.error('Unexpected request: ' + request.method + " : " + request.url);
				response.statusCode = 405;
				response.end();
				return;
			}
			requestContext = {request : request, response : response, storage: storage, path: path, queryString: queryString};
			for (ii = 0; ii < requestHandlers.length; ii++) {
				if (requestHandlers[ii](requestContext)) {
					handled = true;
					console.log(request.method + ' ' + request.url);
					break;
				}
			}
			if (!handled) {
				console.error('Unexpected request: ' + request.method + " : " + request.url);
				response.statusCode = 405;
				response.end();
			}
		}
	} catch (ex) {
		util.checkError(ex, request, response, 'handleRequest');
	}
}

function main(dbName) {
	"use strict";

	storage.init(dbName, function (error) {
		if (error) {
			throw error;
		}

		http.createServer(function (request, response) {
			handleRequest(request, response, storage);
		}).listen(config.port, config.listen_ip);
	});
}

main('local');