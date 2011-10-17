//globals: equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start, golfStatements, console
/*jslint bitwise: true, browser: true, plusplus: true, maxerr: 50, indent: 4 */
function Util() {
	"use strict";
	var ii;

	this.golfStatements = JSON.parse(JSON.stringify(golfStatements)); // "clone"
	for (ii = 0; ii < this.golfStatements.length; ii++) {
		if (this.golfStatements[ii].actor) {
			this.golfStatements[ii].actor.mbox = this.actor.mbox;
			this.golfStatements[ii].actor.name = this.actor.name;
		}
		this.golfStatements[ii].id = this.ruuid();
	}
}

Util.init = function (env) {
	"use strict";
	QUnit.config.testTimeout = 500;

	if (env.id === undefined) {
		// set up test to be shared accross tests (only once)
		env.util = new Util();
		env.id = env.util.ruuid();
		env.statement = {
			actor: {
				"mbox": env.util.actor.mbox,
				"name": env.util.actor.name
			},
			verb: "experienced",
			object: {
				id: env.util.activity.id,
				definition: {}
			}
		};
		env.statement.object.definition.title = env.util.activity.definition.title;
	}
};

Util.prototype.endpoint = "http://localhost:8080/TCAPI";
Util.prototype.auth = "Basic dGVzdDpwYXNzd29yZA==";
Util.prototype.actor = { mbox : "mailto:auto_tests@example.scorm.com", name : "Auto Test Learner"};
Util.prototype.verb = "experienced";
Util.prototype.activity = {id : "http://scorm.com/tincan/autotest/testactivity", definition : { title : 'Tin Can Auto Test Activity' } };
Util.prototype.actorUniqueProps = ['mbox', 'account', 'holdsAccount', 'openid', 'weblog', 'homepage', 'yahooChatID', 'aimChatID', 'skypeID', 'mbox_sha1sum'];

Util.prototype.areActorsEqual = function (source, target) {
	"use strict";
	var prop;

	for (prop in source) {
		if (source.hasOwnProperty(prop) && this.inList(prop, this.actorUniqueProps)) {
			if (source[prop] === target[prop] || JSON.stringify(source[prop]) === JSON.stringify(target[prop])) {
				return true;
			}
		}
	}

	return false;
};

Util.prototype.inList = function (test, list) {
	"use strict";
	var ii;
	for (ii = 0; ii < list.length; ii++) {
		if (test === list[ii] || (typeof test === 'object' && (JSON.stringify(test) === JSON.stringify(list[ii])))) {
			return true;
		}
	}
	return false;
};

Util.prototype.request = function (method, url, data, useAuth, expectedStatus, expectedStatusText, callback) {
	"use strict";
	var xhr = new XMLHttpRequest(),
		actorKey;

	if (method === 'GET') {
		actorKey = JSON.parse(JSON.stringify(this.actor)); // "clone"
		delete actorKey.name; // remove name since it doesn't have the reverse functional property (not useful as part of the ID)
	} else {
		actorKey = this.actor;
	}

	url = url.replace('<activity ID>', encodeURIComponent(this.activity.id));
	url = url.replace('<actor>', encodeURIComponent(JSON.stringify(actorKey)));

	if (method !== 'PUT' && method !== 'POST' && data !== null) {
		throw new Error('data not valid for method: ' + method);
	}

	xhr.open(method, this.endpoint + url, true);
	if (useAuth) {
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Authorization", this.auth);
	}
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (expectedStatus !== undefined && expectedStatusText !== undefined && expectedStatus !== null && expectedStatusText !== null) {
				equal(xhr.status.toString() + ' : ' + xhr.statusText, expectedStatus.toString() + ' : ' + expectedStatusText, method + ': ' + url + ' (status)');
			}
			callback(xhr);
		}
	};
	try {
		xhr.send(data);
	} catch (ex) {
		ok(false, ex.toString());
		console.error(ex.toString());
		start();
	}
};

Util.prototype.validateStatement = function (responseText, statement, id) {
	"use strict";
	var responseObj;

	if (responseText.id !== undefined) {
		responseObj = responseText;
	} else {
		responseObj = this.tryJSONParse(responseText);
	}

	if (responseObj.id === undefined) {
		ok(false, 'statement ID missing');
	}

	ok(responseObj.authority !== undefined, "LRS expected to add authority");
	equal(responseObj.id, id, "LRS expected to use specified ID");
	ok(responseObj.stored !== undefined, "LRS expected to add stored timestamp");


	// since LRS adds these values, comparison will fail if included
	if (statement.id === undefined) {
		delete responseObj.id;
	}
	delete responseObj.authority;
	delete responseObj.stored;
	if (responseObj.context !== undefined && responseObj.context.activity !== undefined) {
		delete responseObj.context.activity.definition;
	}

	deepEqual(responseObj, statement, "statement");
};

Util.prototype.getMultipleTest = function (env, url, queryString) {
	"use strict";
	var testText = 'test test text : ' + env.id,
		urlKey;

	urlKey = url.addFS() + env.id;

	if (queryString === undefined) {
		queryString = '';
	}

	env.util.request('PUT', urlKey + '[1]' + queryString, testText, true, 204, 'No Content', function () {
		env.util.getServerTime(null, function (error, timestamp) {
			env.util.request('PUT', urlKey + '[2]' + queryString, testText, true, 204, 'No Content', function () {
				queryString += (queryString === "" ? '?' : '&') + 'since=' + timestamp.toString();
				env.util.request('GET', url + queryString, null, true, 200, 'OK', function (xhr) {
					var ii, keys, found1, found2;
					keys = env.util.tryJSONParse(xhr.responseText);
					found1 = found2 = false;
					for (ii = 0; ii < keys.length; ii++) {
						if (keys[ii] === env.id + '[1]') {
							found1 = true;
						} else if (keys[ii] === env.id + '[2]') {
							found2 = true;
						}
					}
					ok(found2, 'Key added after timestamp returned');
					ok(!found1, 'Key added before timestamp not returned');
					start();
				});
			});
		});
	});
};

// get the server time, based on when the statement with the specified ID was stored.
// if no ID specified, store a new statement and get its time.
Util.prototype.getServerTime = function (id, callback) {
	"use strict";
	var statement = {},
		util = this;

	// if ID not specified, 
	if (id === null || id === undefined) {
		id = this.ruuid();
		statement.verb = 'imported';
		statement.object = { id: "about:blank" };
		this.request('PUT', '/Statements/' + id, JSON.stringify(statement), true, null, null, function (xhr) {
			util.getServerTime(id, callback);
		});
		return;
	}

	this.request('GET', '/Statements/' + id, null, true, null, null, function (xhr) {
		callback(null, util.tryJSONParse(xhr.responseText).stored);
	});
};

Util.prototype.putGetDeleteStateTest = function (env, url) {
	"use strict";
	var testText = 'profile / state test text : ' + env.id,
		urlKey = url.addFS() + env.id;

	env.util.request('GET', urlKey, null, true, 404, 'Not Found', function () {
		env.util.request('PUT', urlKey, testText, true, 204, 'No Content', function () {
			env.util.request('GET', urlKey, null, true, 200, 'OK', function (xhr) {
				equal(xhr.responseText, testText);
				env.util.request('PUT', urlKey, testText + '_modified', true, 204, 'No Content', function () {
					env.util.request('GET', urlKey, null, true, 200, 'OK', function (xhr) {
						equal(xhr.responseText, testText + '_modified');
						env.util.request('DELETE', urlKey, null, true, 204, 'No Content', function () {
							env.util.request('GET', urlKey, null, true, 404, 'Not Found', function () {
								start();
							});
						});
					});
				});
			});
		});
	});
};

Util.prototype.tryJSONParse = function (text) {
	"use strict";
	try {
		return JSON.parse(text);
	} catch (ex) {
		ok(false, ex.message + ' : ' + text);
		return {};
	}
};

String.prototype.addFS = function () {
	"use strict";
	if (this.charAt(this.length - 1) !== '/') {
		return this.toString() + '/';
	} else {
		return this;
	}
};

Util.prototype.clone = function (a) {
	"use strict";
	return JSON.parse(JSON.stringify(a));
};

/*!
Modified from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
Util.prototype.ruuid = function () {
	"use strict";
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};