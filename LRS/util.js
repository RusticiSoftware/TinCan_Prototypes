/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

/*!
ruuid() is an Excerpt from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

var exports; // placate jsl

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

function inList(test, list) {
	"use strict";
	var ii;
	for (ii = 0; ii < list.length; ii++) {
		if (test === list[ii] || (typeof test === 'object' && (JSON.stringify(test) === JSON.stringify(list[ii])))) {
			return true;
		}
	}
	return false;
}

function isStatementObjectActor(statement) {
	"use strict";
	return (statement.verb === 'mentored' || statement.verb === 'mentored by');
}

function toBool(name, value) {
	"use strict";

	if (value.toLowerCase() === 'false') {
		return false;
	} else if (value.toLowerCase() === 'true') {
		return true;
	} else {
		throw new Error('Bad argument: ' + name + '=' + value.toLowerCase() + ' expected true/false.');
	}
}

function checkError(error, request, response, text) {
	"use strict";
	var errString, context;

	context = text === undefined ? "" : (" (" + text + ") ");
	if (error !== null && error !== undefined) {
		errString = 'ERROR: ' + request.method + " : " + request.url + context;
		errString += (error.stack === undefined ? "\n" + error.toString() :  "\n" + error.stack);
		console.error(errString);
		if (error.HTTPStatus !== undefined) {
			response.writeHead(error.HTTPStatus);
		} else {
			response.writeHead(500);
		}
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

function loadRequestBody(request, callback) {
	"use strict";
	var data;
	data = '';

	request.on('data', function (chunk) {
		data += chunk.toString('ascii');
	});

	request.on('end', function () {
		callback(null, data);
	});
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
	"use strict";
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

function areActorsEqual(source, target) {
	"use strict";
	var prop;

	for (prop in source) {
		if (source.hasOwnProperty(prop)) {
			if (source[prop] === target[prop] || JSON.stringify(source[prop]) === JSON.stringify(target[prop])) {
				return true;
			}
		}
	}

	return false;
}

function addStatementActivities(statement, activities) {
	"use strict";

	if (statement.context !== undefined && statement.context.activity !== undefined) {
		activities.push(statement.context.activity);
	}

	if (!isStatementObjectActor(statement) && statement.object !== undefined) {
		activities.push(statement.object);
	}
}

function addStatementActors(statement, actors) {
	"use strict";
	var context;

	actors.push(statement.authority, statement.actor);
	if (statement.context !== undefined) {
		context = statement.context;
		if (context.instructor !== undefined) {
			actors.push(context.instructor);
		}
		if (context.team !== undefined) {
			actors.push(context.team);
		}
	}
	if (isStatementObjectActor(statement) && statement.object !== undefined) {
		actors.push(statement.object);
	}
}

function hasElementWithProperty(array, property) {
	"use strict";
	var ii, test;
	for (ii = 0; ii < array.length; ii++) {
		for (test in array[ii]) {
			if (array[ii].hasOwnProperty(test) && test === property) {
				return true;
			}
		}
	}
	return false;
}

// parses any properties of the specified object that contain JSON
function parseProps(obj) {
	"use strict";
	var prop;

	for (prop in obj) {
		if (obj.hasOwnProperty(prop) && (/^\s*\{/).test(obj[prop])) {
			obj[prop] = JSON.parse(obj[prop]);
		}
	}
}

exports.ruuid = ruuid;
exports.inList = inList;
exports.toBool = toBool;
exports.isStatementObjectActor = isStatementObjectActor;
exports.checkError = checkError;
exports.parseJSONRequest = parseJSONRequest;
exports.loadRequestBody = loadRequestBody;
exports.isAuthorized = isAuthorized;
exports.getAuthenticatedUser = getAuthenticatedUser;
exports.hasAllProperties = hasAllProperties;
exports.areActorsEqual = areActorsEqual;
exports.addStatementActivities = addStatementActivities;
exports.addStatementActors = addStatementActors;
exports.hasElementWithProperty = hasElementWithProperty;
exports.parseProps = parseProps;