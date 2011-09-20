/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
var methods, collectionNames, actorUniqueProps, async, http, mongodb, requestHandlers, util;

collectionNames = ['statements', 'actors', 'activities', 'state', 'activity_profile'];

async = require('async');
http = require('http');
mongodb = require('mongodb');
requestHandlers = [require('./statement_handler.js'),
	require('./activity_handler.js')];
util = require('./util.js');

function handleRequest(request, response, storage) {
	"use strict";
	var handled, ii, requestContext;

	response.setHeader('Content-Type', 'text/plain');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE');
	response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	try {
		if (request.method === 'OPTIONS') {
			response.end();
		} else if (!util.isAuthorized(request)) {
			response.statusCode = 401;
			response.setHeader('WWW-Authenticate', 'Basic realm="LRS demo"');
			response.end();
		} else {
			handled = false;
			requestContext = {request : request, response : response, storage: storage};
			for (ii = 0; ii < requestHandlers.length; ii++) {
				if (requestHandlers[ii].handleRequest(requestContext)) {
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

function main() {
	"use strict";
	var mongoserver, db, storage;

	mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT);
	db = new mongodb.Db('local', mongoserver);
	storage = require('./storage.js');

	db.open(function (err, db) {
		if (err === null) {
			console.log("DB 'local' Initialized");
			async.map(collectionNames, function (collectionName, callback) {
				db.collection(collectionName, callback);

			}, function (err, collectionsArray) {
				var ii, server;

				if (err !== null && err !== undefined) {
					console.log("error: " + err);
					throw err;
				}

				for (ii = 0; ii < collectionsArray.length; ii++) {
					//collectionsArray[ii].remove({});
					storage.collections[collectionsArray[ii].collectionName] = collectionsArray[ii];
				}

				server = http.createServer(function (request, response) {
					handleRequest(request, response, storage);
				});
				server.listen(8080, "127.0.0.1");
			});
		} else {
			throw err;
		}
	});
}

main();