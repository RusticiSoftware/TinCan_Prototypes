/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4 */
var statementsEnv = {placeholder : 'fizz'};

module('Statements', {
	setup: function () {
		"use strict";
		Util.init(statementsEnv);
	}
});


asyncTest('empty statement PUT', 2, function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('PUT', '/Statements/' + statementsEnv.id, null, true, 500, 'Internal Server Error', start);
});

asyncTest('empty statement POST', 2, function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('POST', '/Statements/', null, true, 500, 'Internal Server Error', start);
});

asyncTest('PUT / GET', 8, function () {
	"use strict";
	var env = statementsEnv,
		url = '/Statements/' + env.id;

	env.util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function (xhr) {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, env.statement, env.id);
			start();
		});
	});
});

asyncTest('Authentication', 4, function () {
	"use strict";
	var env = statementsEnv,
		url = '/Statements/' + env.id,
		util = env.util;


	util.request('PUT', url, JSON.stringify(env.statement), false, 401, 'Unauthorized', function (xhr) {
		util.request('GET', url, null, false, 401, 'Unauthorized', function (xhr) {
			start();
		});
	});
});

asyncTest('Reject Modification', 10, function () {
	"use strict";

	var env = statementsEnv,
		util = env.util,
		id = util.ruuid(),
		url = '/Statements/' + id;

	util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function (xhr) {
		util.request('PUT', url, JSON.stringify(env.statement).replace('experienced', 'passed'), true, 409, 'Conflict', function (xhr) {
			util.request('GET', url, null, true, 200, 'OK', function (xhr) {
				util.validateStatement(xhr.responseText, env.statement, id);
				start();
			});
		});
	});
});

asyncTest('Reject Actor Modification', 10, function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		otherId = util.ruuid(),
		url = '/Statements/' + otherId,
		modLearnerName = 'Renamed Auto Test Learner';


	util.request('PUT', url, JSON.stringify(env.statement).replace(env.statement.actor.name, modLearnerName), true, 204, 'No Content', function (xhr) {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response;
			response = JSON.parse(xhr.responseText);


			// verify statement is returned with modified name, but then undo modification for checking the rest of the statement
			equal(response.actor.name, modLearnerName);
			response.actor.name = env.statement.actor.name;
			util.validateStatement(JSON.stringify(response), env.statement, otherId);


			// verify actor still has original name
			ok(false, 'TODO: verify actor still has original name');
			start();
		});
	});
});


asyncTest('POST', 2, function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/';


	util.request('POST', url, JSON.stringify(util.golfStatements), true, 200, 'OK', function (xhr) {
		console.log(xhr.responseText);
		start();
	});
});