/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4 */
var statementsEnv = {placeholder : 'fizz'};

module('Statements', {
	setup: function () {
		"use strict";
		Util.init(statementsEnv);
	}
});


asyncTest('empty statement PUT', function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('PUT', '/Statements/' + statementsEnv.id, null, true, 500, 'Internal Server Error', start);
});

asyncTest('empty statement POST', function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('POST', '/Statements/', null, true, 500, 'Internal Server Error', start);
});

asyncTest('PUT / GET', function () {
	"use strict";
	var env = statementsEnv,
		url = '/Statements/' + env.id;

	env.util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, env.statement, env.id);
			start();
		});
	});
});

asyncTest('Authentication', function () {
	"use strict";
	var env = statementsEnv,
		url = '/Statements/' + env.id,
		util = env.util;


	util.request('PUT', url, JSON.stringify(env.statement), false, 401, 'Unauthorized', function () {
		util.request('GET', url, null, false, 401, 'Unauthorized', function () {
			start();
		});
	});
});

asyncTest('Reject Modification', function () {
	"use strict";

	var env = statementsEnv,
		util = env.util,
		id = util.ruuid(),
		url = '/Statements/' + id;

	util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function () {
		util.request('PUT', url, JSON.stringify(env.statement).replace('experienced', 'passed'), true, 409, 'Conflict', function () {
			util.request('GET', url, null, true, 200, 'OK', function (xhr) {
				util.validateStatement(xhr.responseText, env.statement, id);
				start();
			});
		});
	});
});

asyncTest('Reject Actor Modification', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		otherId = util.ruuid(),
		url = '/Statements/' + otherId,
		modLearnerName = 'Renamed Auto Test Learner';

	util.request('PUT', url, JSON.stringify(env.statement).replace(env.statement.actor.name, modLearnerName), true, 204, 'No Content', function () {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response;
			response = util.tryJSONParse(xhr.responseText);


			// verify statement is returned with modified name, but then undo modification for checking the rest of the statement
			equal(response.actor.name, modLearnerName);
			response.actor.name = env.statement.actor.name;
			util.validateStatement(JSON.stringify(response), env.statement, otherId);

			util.request('GET', '/actors/<actor>/', null, true, 200, 'OK', function (xhr) {
				equal(util.tryJSONParse(xhr.responseText).name, env.statement.actor.name, 'Actor should not have been renamed based on statement.');
				start();
			});
		});
	});
});

asyncTest('Bad Verb', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'not a valid verb';
	util.request('PUT', url, JSON.stringify(statement), true, 400, 'Bad Request', function (xhr) {
		// should return an error message, can't validatate content, but make sure it's there
		ok(xhr.responseText !== null && xhr.responseText.length > 0, "Message returned");
		util.request('GET', url, null, true, 404, 'Not Found', function () {
			start();
		});
	});
});

asyncTest('Bad ID', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/' + util.ruuid() + 'bad_id',
		statement = util.clone(env.statement);

	util.request('PUT', url, JSON.stringify(statement), true, 400, 'Bad Request', function (xhr) {
		// should return an error message, can't validatate content, but make sure it's there
		ok(xhr.responseText !== null && xhr.responseText.length > 0, "Message returned");
		util.request('GET', url, null, true, 400, 'Bad Request', function () {
			start();
		});
	});
});

asyncTest('pass special handling', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'passed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function (xhr) {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response = JSON.parse(xhr.responseText);
			equal(response.verb, 'passed', 'verb');
			equal(response.result.success, true, 'success');
			equal(response.result.completion, true, 'completion');
			start();
		});
	});
});

asyncTest('fail special handling', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'failed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function (xhr) {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response = JSON.parse(xhr.responseText);
			equal(response.verb, 'failed', 'verb');
			equal(response.result.success, false, 'success');
			equal(response.result.completion, true, 'completion');
			start();
		});
	});
});

asyncTest('completed special handling', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'completed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function (xhr) {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response = JSON.parse(xhr.responseText);
			equal(response.verb, 'completed', 'verb');
			equal(response.result.completion, true, 'completion');
			start();
		});
	});
});


asyncTest('POST', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/Statements/';


	util.request('POST', url, JSON.stringify(util.golfStatements), true, 200, 'OK', function (xhr) {
		console.log(xhr.responseText);
		start();
	});
});