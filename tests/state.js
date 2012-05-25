/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4, plusplus: true */
var stateEnv = {};

module('State', {
	setup: function () {
		"use strict";
		Util.init(stateEnv);
	}
});

/*PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>/<State ID>[?registration=<registration>]

Stores, fetches, or deletes the specified state document in the context of the specified activity, actor, and registration (if specified). Actor may be an individual or a team.

DELETE http://example.com/TCAPI/activities/<activity ID>/state/<actor>[/?registration=<registration>]

Deletes all state data for this context (activity + actor [+ registration if specified]).

GET http://example.com/TCAPI/activities/<activity ID>/state/<actor>[/<registration][?since=<timestamp>]
*/

function putGetStateTest(env, useRegistration) {
	"use strict";
	var url = '/activities/state?activityId=<activity ID>&actor=<actor>&stateId=' + env.id,
		reg = '',
		wrongReg = '',
		stateText = 'state test text : ' + env.id;

	if (useRegistration) {
		reg = '&registration=autoTestReg1';
		wrongReg = '&registration=autoTestRegWRONG';
	}

    var headers = {"Content-Type":"text/plain"};
	env.util.request('GET', url + reg, null, true, 404, 'Not Found', function () {
		env.util.requestWithHeaders('PUT', url + reg, headers, stateText, true, 204, 'No Content', function () {
			env.util.request('GET', url + wrongReg, null, true, useRegistration ? 404 : 200, useRegistration ? 'Not Found' : 'OK', function () {
				env.util.request('GET', url + reg, null, true, 200, 'OK', function (xhr) {
					equal(xhr.responseText, stateText);
					env.util.request('DELETE', url + reg, null, true, 204, 'No Content', function () {
						env.util.request('GET', url + reg, null, true, 404, 'Not Found', function () {
							start();
						});
					});
				});
			});
		});
	});
}

function clearStateTest(env, useRegistration) {
	"use strict";
	var reg = '',
		url = '/activities/state?activityId=<activity ID>&actor=<actor>',
		urlKey = url + '&stateId=' + env.id,
		stateText = 'state test text : ' + env.id;

	if (useRegistration) {
		reg = '&registration=autoTestReg1';
	}
	var ii = 1;

	env.util.request('GET', urlKey + reg + '&sequence=1&ii=' + ii++, null, true, 404, 'Not Found', function (xhr) {
		env.util.request('PUT', urlKey + reg + '&sequence=2&ii=' + ii++, stateText, true, 204, 'No Content', function (xhr) {
			env.util.request('GET', urlKey + '&sequence=3&ii=' + ii++, null, true, useRegistration ? 404 : 200, useRegistration ? 'Not Found' : 'OK', function (xhr) {
				env.util.request('GET', urlKey + reg + '&sequence=4&ii=' + ii++, null, true, 200, 'OK', function (xhr) {
					equal(xhr.responseText, stateText, "sequence=5&ii=" + ii++);
					env.util.request('DELETE', url + reg + '&sequence=6&ii=' + ii++, null, true, 204, 'No Content', function (xhr) {
						env.util.request('GET', urlKey + reg + '&sequence=7&ii=' + ii++, null, true, 404, 'Not Found', function (xhr) {
							start();
						});
					});
				});
			});
		});
	});
}


asyncTest('PUT/GET/DELETE', function () { "use strict"; putGetStateTest(stateEnv, false); });
asyncTest('PUT/GET/DELETE (with registration)', function () { "use strict"; putGetStateTest(stateEnv, true); });
asyncTest('clear state', function () { "use strict"; clearStateTest(stateEnv, false); });
asyncTest('clear state (registration)', function () { "use strict"; clearStateTest(stateEnv, true); });
asyncTest('GET multiple state keys', function () {
	"use strict";
	stateEnv.util.getMultipleTest(stateEnv, '/activities/state?activityId=<activity ID>&actor=<actor>','stateId');
});

asyncTest('GET multiple state keys (with registration)', function () {
	"use strict";
	stateEnv.util.getMultipleTest(stateEnv, '/activities/state?activityId=<activity ID>&actor=<actor>&registration=autoTestReg1','stateId' );
});

asyncTest('Concurrency Rules', function(){
    "use strict";
    var env = stateEnv;
    var url = "/activities/state?activityId=<activity ID>&actor=<actor>&stateId=" + env.util.ruuid();
    env.util.concurrencyRulesTest(env, url, false);
});

asyncTest('missing State id', function() {
	"use strict";

    var env = stateEnv;
	var reg = '',
		url = '/activities/state?activityId=<activity ID>&actor=<actor>',
		urlKey = url + '&stateBadid=' + env.id,
		stateText = 'state test text : ' + env.id;

	env.util.request('PUT', urlKey, stateText, true, 400, 'Bad Request', function (xhr) {
		start();
	});	
});
