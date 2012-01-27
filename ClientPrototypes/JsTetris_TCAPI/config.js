//globals: equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start, golfStatements, console
/*jslint bitwise: true, browser: true, plusplus: true, maxerr: 50, indent: 4 */
function Config() {
	"use strict";
}
Config.endpoint = "http://localhost:8080/ScormEngineInterface/TCAPI/";
Config.authUser = "testuser2.autotest@scorm.example.com";
Config.authPassword = "password";
Config.actor = { "mbox":["david.ells@scorm.com"], "name":["David Ells"] };
