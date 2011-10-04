function Util() {
	"use strict";
	var ii;

	this.golfStatements = JSON.parse(JSON.stringify(golfStatements)); // "clone"
	for (ii = 0; ii < this.golfStatements.length; ii++) {
		this.golfStatements[ii].actor.mbox = this.actor.mbox;
		this.golfStatements[ii].actor.name = this.actor.name;
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
			equal(xhr.status.toString() + ' : ' + xhr.statusText, expectedStatus.toString() + ' : ' + expectedStatusText, method + ': ' + url + ' (status)');
			callback(xhr);
		}
	};
	xhr.send(data);
};

Util.prototype.validateStatement = function (responseText, statement, id) {
	"use strict";
	var responseObj = this.tryJSONParse(responseText);

	ok(responseObj.authority !== undefined, "LRS expected to add authority");
	equal(responseObj.id, id, "LRS expected to use specified ID");
	ok(responseObj.stored !== undefined, "LRS expected to add stored timestamp");


	// since LRS adds these values, comparison will fail if included
	delete responseObj.id;
	delete responseObj.authority;
	delete responseObj.stored;

	deepEqual(responseObj, statement, "statement");
};

Util.prototype.getMultipleTest = function (env, url, queryString) {
	"use strict";
	var reg = '',
		testText = 'test test text : ' + env.id,
		urlKey;

	urlKey = url.addFS() + env.id;

	if (queryString === undefined) {
		queryString = '';
	}

	env.util.request('PUT', urlKey + '[1]' + queryString, testText, true, 204, 'No Content', function () {
		env.util.request('PUT', urlKey + '[2]' + queryString, testText, true, 204, 'No Content', function () {
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
				ok(found1 && found2, 'Return keys just added');
				start();
			});
		});
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
				env.util.request('DELETE', urlKey, null, true, 204, 'No Content', function () {
					env.util.request('GET', urlKey, null, true, 404, 'Not Found', function () {
						start();
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
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}