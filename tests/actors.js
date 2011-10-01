/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4, plusplus: true */
var actorEnv = {};

module('Actors', {
	setup: function () {
		"use strict";
		Util.init(actorEnv);
	}
});

//PUT | GET | DELETE http://example.com/TCAPI/actors/<actor>/profile/<profile object key>
asyncTest('Profile',function () {
	"use strict";
	actorEnv.util.putGetDeleteStateTest(actorEnv, '/actors/<actor>/profile/');
});

//GET http://example.com/TCAPI/actors/<actor>
asyncTest('Definition', 3, function () {
	"use strict";
	var env = actorEnv,
		url = env.util.buildURL(env, '/actors/<actor>');

	env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
		var profile;
		try {
			profile = JSON.parse(xhr.responseText);
		} catch (ex) {
			profile = {};
		}
		equal(profile.mbox, env.util.actor.mbox, 'actor mbox');
		start();
	});
});

//GET http://example.com/TCAPI/actors/<actor>/profile[?since=<timestamp>]
asyncTest('Profile, multiple', function() {
	"use strict";
	actorEnv.util.getMultipleTest(actorEnv, '/actors/<actor>/profile');
});
