/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4 */
var statementsEnv = {};

module('Statements', {
	setup: function () {
		"use strict";
		Util.init(statementsEnv);
	}
});

asyncTest('empty statement PUT', function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('PUT', '/statements?statementId=' + statementsEnv.id, null, true, 400, 'Bad Request', start);
});

asyncTest('empty statement POST', function () {
	// empty statement should fail w/o crashing the LRS (error response shoudl be received)
	"use strict";
	statementsEnv.util.request('POST', '/statements/', null, true, 400, 'Bad Request', start);
});

asyncTest('PUT / GET', function () {
	"use strict";
	var env = statementsEnv,
		url = '/statements?statementId=' + env.id;

	env.util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, env.statement, env.id);
			start();
		});
	});
});

asyncTest('POST /w ID', function () {
	"use strict";
	var env = statementsEnv,
		url = '/statements?statementId=' + env.id;

	env.util.request('POST', url, JSON.stringify(env.util.golfStatements), true, 405, 'Method Not Allowed', function () {
		start();
	});
});


asyncTest('Authentication', function () {
	"use strict";
	var env = statementsEnv,
		url = '/statements?statementId=' + env.id,
		util = env.util;


	util.request('PUT', url, JSON.stringify(env.statement), false, 401, 'Unauthorized', function () {
		util.request('GET', url, null, false, 401, 'Unauthorized', function () {
			start();
		});
	});
});

asyncTest('Reject Statement Modification', function () {
	"use strict";

	var env = statementsEnv,
		util = env.util,
		id = util.ruuid(),
		url = '/statements?statementId=' + id;

	util.request('PUT', url, JSON.stringify(env.statement), true, 204, 'No Content', function () {
		util.request('PUT', url, JSON.stringify(env.statement).replace('experienced', 'passed'), true, 409, 'Conflict', function () {
			util.request('GET', url, null, true, 200, 'OK', function (xhr) {
				util.validateStatement(xhr.responseText, env.statement, id);
				start();
			});
		});
	});
});

asyncTest('PUT / GET w/ Extensions', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myRegId = env.util.ruuid();
    var myStatement = {
        id: myStatementId,
        actor: env.statement.actor,
        verb: "passed",
        object: env.statement.object,
        context: {
            registration: myRegId,
            extensions: {
                ctx_extension_1: 1234
            }
        },
        result: {
            score: { scaled: 0.87 },
            success: true,
            completion: true,
            extensions: {
                extension_1: "some value"
            }
        }
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, myStatement, myStatementId);
			start();
		});
	});
        
});

asyncTest('PUT / GET w/ Revision and Platform', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myRegId = env.util.ruuid();
    var myStatement = {
        id: myStatementId,
        actor: env.statement.actor,
        verb: "experienced",
        object: env.statement.object,
        context: {
            registration: myRegId,
            revision:"3",
            platform:"iOS"
        }
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, myStatement, myStatementId);
			start();
		});
	});
});

asyncTest('PUT / GET Actor as Object', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myStatement = {
        id: myStatementId,
        verb: "imported",
        object: env.statement.object,
        actor: env.statement.actor
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, myStatement, myStatementId);
			start();
		});
	});
        
});

// verify a valid duration format is stored and returned
// note -- could result in false negative if LRS represents the same duration in another way
asyncTest('Duration', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myStatement = {
        id: myStatementId,
        actor: env.statement.actor,
        verb: "attempted",
        object: env.statement.object,
        result: {duration: "P1Y2MT10M15.12S"} 
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, myStatement, myStatementId);
			start();
		});
	});
        
});

// verify a valid duration format is stored and returned
// note -- could result in false negative if LRS represents the same duration in another way
asyncTest('Reject Bad duration', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myStatement = {
        id: myStatementId,
        verb: "attempted",
        object: env.statement.actor,
        result: { duration: "not a duration" }
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 400, 'Bad Request', function () {
		start();
	});
        
});


asyncTest('Actor Modification', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		otherId = util.ruuid(),
		url = '/statements?statementId=',
        origStatement = JSON.parse(JSON.stringify(env.statement)),
		modLearnerName = 'Renamed Auto Test Learner',
		modStatement;

    origStatement.actor.mbox = ["mailto:modification.test@projecttincan.com"];

	util.request('PUT', url + util.ruuid(), JSON.stringify(origStatement), true, null, null, function () {
		modStatement = JSON.stringify(origStatement).replace(origStatement.actor.name[0], modLearnerName);
		util.request('PUT', url + otherId, modStatement , true, 204, 'No Content', function () {
			util.request('GET', url + otherId, null, true, 200, 'OK', function (xhr) {
				var response;
				response = util.tryJSONParse(xhr.responseText);

				// verify statement is returned with modified name
				ok(util.inList(modLearnerName, response.actor.name), "modified name in list of names");
				response.actor.name = [modLearnerName];
				util.validateStatement(JSON.stringify(response), JSON.parse(modStatement), otherId);

                var actorParam = encodeURIComponent(JSON.stringify(origStatement.actor));
				util.request('GET', '/actors?actor=' + actorParam, null, true, 200, 'OK', function (xhr) {
					util.testListInList([origStatement.actor.name[0],modLearnerName], util.tryJSONParse(xhr.responseText).name, 'Both actor names should now be reflected on actor object.');
					start();
				});
			});
		});
	});
});

asyncTest('Actor Transitive equalilty', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		otherId = util.ruuid(),
		url = '/statements?',
		modLearnerName = 'Renamed Auto Test Learner',
		modStatements, prop, ids, resultIds = [], resultStatements, ii, account, mbox1, mbox2;
		
	account = [ { accountServiceHomePage : "http://projecttincan.com/TCAPI_autotest/"+otherId, accountName : "autotestuser"}];
	mbox1 = ["mailto:" + otherId + "3@example.scorm.com"];
	mbox2 = ["mailto:" + otherId + "2@example.scorm.com"];

	modStatements = [util.clone(env.statement),util.clone(env.statement),util.clone(env.statement),util.clone(env.statement)];
	modStatements[0].actor = { mbox: mbox1, name: ["Auto Test Transitive Learner " + otherId]}
	modStatements[1].actor = { openid : ["http://example.com/some_unique_openId_autotest_"+otherId], account : account };
	modStatements[2].actor = { mbox: [mbox1[0],mbox2[0]] };
	modStatements[3].actor = { mbox_sha1sum: [""], account :account };
	modStatements[3].actor.mbox_sha1sum[0] = Crypto.util.bytesToHex(Crypto.SHA1(mbox2[0], { asBytes: true }));
	util.request('POST', url, JSON.stringify(modStatements), true, 200, 'OK', function (xhr) {

		ids = util.tryJSONParse(xhr.responseText);

		// should be able to find all four statements based on initial actor information
		var filters = [];
		var queryString = [];
		filters.actor = JSON.stringify(modStatements[0].actor, null, 4);
		filters.limit='4';
		
		for (prop in filters) {
			if (filters.hasOwnProperty(prop)) {
				queryString.push(prop + '=' + encodeURIComponent(filters[prop]));
			}
		}

		util.request('GET', url +  queryString.join('&'), null, true, 200, 'OK', function (xhr) {
			resultStatements = util.tryJSONParse(xhr.responseText).statements;
			for (ii = 0; ii < resultStatements.length; ii++) {
				resultIds.push(resultStatements[ii].id);
			}
			util.testListInList(ids, resultIds, "should be able to get back all statements based on first actor.: " + url +  queryString.join('&'));
			start();
		});
	});
});

asyncTest('Actor Transitive equalilty, multi-post', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		otherId = util.ruuid(),
		url = '/statements?',
		modLearnerName = 'Renamed Auto Test Learner',
		modStatements, prop, ids, resultIds = [], resultStatements, ii, account, mbox1, mbox2;
		
	account = [ { accountServiceHomePage : "http://projecttincan.com/TCAPI_autotest/"+otherId, accountName : "autotestuser"}];
	mbox1 = ["mailto:" + otherId + "3@example.scorm.com"];
	mbox2 = ["mailto:" + otherId + "2@example.scorm.com"];

	ids = [util.ruuid(), util.ruuid(), util.ruuid(), util.ruuid()];

	modStatements = [util.clone(env.statement),util.clone(env.statement),util.clone(env.statement),util.clone(env.statement)];
	modStatements[0].actor = { mbox: mbox1, name: ["Auto Test Transitive Learner " + otherId]}
	modStatements[1].actor = { openid : ["http://example.com/some_unique_openId_autotest_"+otherId], account : account };
	modStatements[2].actor = { mbox: [mbox1[0],mbox2[0]] };
	modStatements[3].actor = { mbox_sha1sum: [""], account :account };
	modStatements[3].actor.mbox_sha1sum[0] = Crypto.util.bytesToHex(Crypto.SHA1(mbox2[0], { asBytes: true }));
	
	for ( ii = 0; ii < ids.length; ii++) {
		modStatements[ii].id = ids[ii];
	}
	util.request('POST', url, JSON.stringify([modStatements[0]]), true, 200, 'OK', function () {
		util.request('POST', url, JSON.stringify([modStatements[1]]), true, 200, 'OK', function () {
			util.request('POST', url, JSON.stringify([modStatements[2]]), true, 200, 'OK', function () {
				util.request('POST', url, JSON.stringify([modStatements[3]]), true, 200, 'OK', function () {

					// should be able to find all four statements based on initial actor information
					var filters = [];
					var queryString = [];
					filters.actor = JSON.stringify(modStatements[0].actor, null, 4);
					filters.limit='4';
					
					util.request('GET', url +  util.buildQueryString(filters), null, true, 200, 'OK', function (xhr) {
						resultStatements = util.tryJSONParse(xhr.responseText).statements;
						for (ii = 0; ii < resultStatements.length; ii++) {
							resultIds.push(resultStatements[ii].id);
						}
						util.testListInList(ids, resultIds, "should be able to get back all statements based on first actor.: " + url +  queryString.join('&'));
						
						util.request('GET', '/actors?actor=' + encodeURIComponent(filters.actor), null, true, 200, 'OK', function (xhr) {
							util.testListInList([mbox1[0], mbox2[0]], util.tryJSONParse(xhr.responseText).mbox, 'Mboxes for all actors should now be reflected on actor object.');
							start();
						});
					});
				});
			});
		});
	});
});



asyncTest('Reject Bad Verb', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements?statementId=' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'not a valid verb';
	util.request('PUT', url, JSON.stringify(statement), true, 400, 'Bad Request', function (xhr, usingIEMode) {
		// should return an error message, can't validatate content, but make sure it's there
        util.log("bad verb response: " + xhr.responseText);
        if(!usingIEMode){
		    ok(xhr.responseText !== null && xhr.responseText.length > 0, "Message returned");
        }
		util.request('GET', url, null, true, 404, 'Not Found', function () {
			start();
		});
	});
});

asyncTest('Reject Bad ID', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements?statementId=' + encodeURIComponent(util.ruuid() + 'bad_id'),
		statement = util.clone(env.statement);

	util.request('PUT', url, JSON.stringify(statement), true, 400, 'Bad Request', function (xhr, usingIEMode) {
		// should return an error message, can't validatate content, but make sure it's there
        if(!usingIEMode){
		    ok(xhr.responseText !== null && xhr.responseText.length > 0, "Message returned");
        }
		util.request('GET', url, null, true, 400, 'Bad Request', function () {
			start();
		});
	});
});

asyncTest('Reject Bad interactionType', function() {
    "use strict";
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;

    var myObj = env.util.clone(env.statement.object);
    myObj["definition"] = {
        type: "cmi.interaction",
        interactionType: "bad type"
    };

    var myStatement = {
        id: myStatementId,
        actor: env.statement.actor,
        verb: "attempted",
        object: myObj
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 400, 'Bad Request', function () {
		start();
	});
});


asyncTest('Interaction Components', function() {
    "use strict";
    var env = statementsEnv;

    var activity = { id: "scorm.com/interaction_definition_test_" + env.util.ruuid() };

    var components = [
        {id: "1", description:{"en-US": "Interaction Component #1"}},
        {id: "2", description:{"en-US": "Interaction Component #2"}},
        {id: "3", description:{"en-US": "Interaction Component #3"}},
        {id: "4", description:{"en-US": "Interaction Component #4"}}
    ];

    function checkComponentSet(interactionType, componentName, shouldWork, callback){
        activity["definition"] = {
            type: "cmi.interaction",
            interactionType: interactionType
        };
        activity.definition[componentName] = components;

        var stmt = {id: env.util.ruuid(), actor: env.statement.actor, verb: "answered", object: activity};

        var url = '/statements?statementId=' + stmt.id;
        var expectedCode = shouldWork ? 204 : 400;
        var expectedMsg = shouldWork ? 'No Content' : 'Bad Request';
	    env.util.request('PUT', url, JSON.stringify(stmt), true, expectedCode, expectedMsg, function(){ callback(null); });
    }

    async.waterfall([
        //Make sure setting these components on the wrong type fail
        function(cb){ checkComponentSet("true-false", "source", false, cb); },
        function(cb){ checkComponentSet("choice", "source", false, cb); },
        function(cb){ checkComponentSet("fill-in", "choices", false, cb); },
        function(cb){ checkComponentSet("likert", "choices", false, cb); },
        function(cb){ checkComponentSet("matching", "scale", false, cb); },
        function(cb){ checkComponentSet("performance", "scale", false, cb); },
        function(cb){ checkComponentSet("sequencing", "target", false, cb); },

        //Make sure setting these components on the right type succeed
        function(cb){ checkComponentSet("choice", "choices", true, cb); },
        function(cb){ checkComponentSet("likert", "scale", true, cb); },
        function(cb){ checkComponentSet("matching", "source", true, cb); },
        function(cb){ checkComponentSet("matching", "target", true, cb); },
        function(cb){ checkComponentSet("performance", "steps", true, cb); },
        function(cb){ checkComponentSet("sequencing", "choices", true, cb); },

        //Start the test runner again
        start
    ]);
});


asyncTest('Reject Bad activityType', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;

    var myObj = env.util.clone(env.statement.object);
    myObj["definition"] = {type: "bad type"};

    var myStatement = {
        id: myStatementId,
        actor: env.statement.actor,
        verb: "attempted",
        object: myObj
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 400, 'Bad Request', function () {
		start();
	});
});

asyncTest('Reject Bad mbox', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;

    var myActor = env.util.clone(env.statement.actor);
    myActor.mbox = ["example@scorm.com"]; //invalid, missing mailto: prefix

    var myStatement = {
        id: myStatementId,
        actor: myActor,
        verb: "attempted",
        object: env.statement.object
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 400, 'Bad Request', function () {
		start();
	});

    myActor.mbox = ["mailto:not_valid_email"]; 

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 400, 'Bad Request', function () {
		start();
	});
        
});

asyncTest('pass special handling', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements?statementId=' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'passed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function () {
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
		url = '/statements?statementId=' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'failed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function () {
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
		url = '/statements?statementId=' + util.ruuid(),
		statement = util.clone(env.statement);

	statement.verb = 'completed';

	util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function () {
		util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			var response = JSON.parse(xhr.responseText);
			equal(response.verb, 'completed', 'verb');
			equal(response.result.completion, true, 'completion');
			start();
		});
	});
});

asyncTest('POST multiple', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/',
		golfStatements = util.golfStatements;

	util.request('POST', url, JSON.stringify(golfStatements), true, 200, 'OK', function (xhr) {
		var ids = env.util.tryJSONParse(xhr.responseText),
			object,
			ii,
			testId = ids[ids.length - 5]; // first few statements aren't good examples, grab a later one

		for (ii = 0; ii < golfStatements.length; ii++) {
			if (golfStatements[ii].id === testId) {
				object = encodeURIComponent(JSON.stringify(golfStatements[ii].object, null, 4));

				env.util.request('GET', url + '?limit=5&sparse=false&object=' + object, null, true, 200, 'OK', function (xhr) {
					var result = util.tryJSONParse(xhr.responseText);
                    var statements = result.statements;
					for (var jj = 0; jj < statements.length; jj++) {
						if (statements[jj].id === golfStatements[ii].id) {
							delete statements[jj].object.definition;
							env.util.validateStatement(statements[jj], golfStatements[ii], testId);
							start();
							return;
						}
					}

					ok(false, 'Returned statement ID "' + testId + '" not found.');
					start();
				});
				return;
			}
		}
		ok(false, 'Returned statement ID "' + testId + '" not found.');
		start();
		return;
	});
});

asyncTest('GET statements, simple', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/';


	util.request('GET', url + '?limit=1', null, true, 200, 'OK', function (xhr) {
		var result = util.tryJSONParse(xhr.responseText).statements;
		equal(result.length, 1, 'GET limit 1');
		ok(result[0].verb !== undefined, 'statement has verb (is a statement)');
		start();
	});
});

asyncTest('GET statements, ascending', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/';


	util.request('GET', url + '?limit=5', null, true, 200, 'OK', function (xhr) {
		var result = util.tryJSONParse(xhr.responseText).statements;
        var isAscending = true;
        var storedDate = '0';
        for(var i = 0; i < result.length; i++){
            if(!result[i].stored > storedDate){
                isAscending = false;
                break;
            } 
            storedDate = result[i].stored;
        }
		ok(isAscending, 'statements recieved in ascending order');
		start();
	});
});

asyncTest('GET statements, continue token (descending)', function () {
    continueTokenTest(false);
});

asyncTest('GET statements, continue token (ascending)', function () {
    continueTokenTest(true);
});

function continueTokenTest(ascending){
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/';

    var recordsAtOnce = null;
    var recordsOverPages = new Array();
    var dateFilterStr = "";

    ascending = (ascending == null || ascending == false) ? false : true;
    var ascendingStr = "&ascending=" + ascending;

    async.waterfall([
        function(cb){
            //Normal get, to grab a few record to help verify
	        util.request('GET', url + '?limit=6' + ascendingStr, null, true, 200, 'OK', 
                function (xhr) {
                    recordsAtOnce = util.tryJSONParse(xhr.responseText).statements;
                    if(ascending == false){
                        dateFilterStr = '&until=' + encodeURIComponent(recordsAtOnce[0].stored.toString());
                    } else {
                        var filterDate = util.DateFromISOString(recordsAtOnce[0].stored);
                        filterDate.setTime(filterDate.getTime() - 1);
                        dateFilterStr = "&since=" + encodeURIComponent(util.ISODateString(filterDate));
                    }
                    cb(null);
            });
        },
        function(cb){
            //Get first page, just two records...
        	util.request('GET', url + '?limit=2' + ascendingStr + dateFilterStr, null, true, 200, 'OK', function (xhr) {
        		var result = util.tryJSONParse(xhr.responseText);
                var statements = result.statements;
        		equal(statements.length, 2, 'GET limit 2');
                recordsOverPages = recordsOverPages.concat(statements);
                cb(null, result.more);
            });
        },
        function(moreUrl, cb){
            //Get next page, two more records...
            util.request('GET', moreUrl, null, true, 200, 'OK', function(xhr) {
		        var result = util.tryJSONParse(xhr.responseText);
                var statements = result.statements;
		        equal(statements.length, 2, 'GET (more url) limit 2');
                recordsOverPages = recordsOverPages.concat(statements);
                cb(null, result.more);
            });
        },
        function(moreUrl, cb){
            //Get next page, two more records...
            util.request('GET', moreUrl, null, true, 200, 'OK', function(xhr) {
		        var result = util.tryJSONParse(xhr.responseText);
                var statements = result.statements;
		        equal(statements.length, 2, 'GET (second more url) limit 2');
                recordsOverPages = recordsOverPages.concat(statements);
                cb(null);
            });
        },
        function(cb){
            //Compare all at once results to paged results...
            equal(recordsAtOnce.length, recordsOverPages.length, 'Paged result same as all at once');
            for(var i = 0; i < recordsOverPages.length; i++){
                equal(recordsOverPages[i].id, recordsAtOnce[i].id, 'Statement ' + i + ' must have same id in both results');
            }
            cb(null);
        },
        //Start the test runner again...
        start
    ]);

}

asyncTest('GET statements (via POST), simple', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/';


	util.request('POST', url, 'limit=1', true, 200, 'OK', function (xhr) {
		var result = util.tryJSONParse(xhr.responseText).statements;
		equal(result.length, 1, 'POST limit 1');
		ok(result[0].verb !== undefined, 'statement has verb (is a statement)');
		start();
	});
});


asyncTest('GET statements, context', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/',
		statement = util.clone(env.statement),
		ctxActId = statement.object.id+'__context',
		filters, result;

	statement.id = util.ruuid();
	statement.context = { contextActivities : { parent : { id: ctxActId }}};
		
	util.request('PUT', url + '?statementId=' + statement.id, JSON.stringify(statement), true, 204, 'No Content', function () {

		filters = { object : JSON.stringify(statement.object), limit : 1 };
		util.request('GET', url + '?' + util.buildQueryString(filters), null, true, 200, 'OK', function (xhr) {
			result = util.tryJSONParse(xhr.responseText);
			equal(result.statements[0].id, statement.id, 'found saved statement with activity filter');
			
			filters.object = JSON.stringify({ id : ctxActId});
			util.request('GET', url + '?' + util.buildQueryString(filters), null, true, 200, 'OK', function (xhr) {
				result = util.tryJSONParse(xhr.responseText);
				equal(result.statements.length, 0, 'should not find any saved statement with context activity filter and context not set');
				
				filters.context = true;
				util.request('GET', url + '?' + util.buildQueryString(filters), null, true, 200, 'OK', function (xhr) {
					result = util.tryJSONParse(xhr.responseText);
					equal(result.statements[0].id, statement.id, 'found saved statement with context parameter + context activity');

					filters.object = JSON.stringify(statement.object);
					util.request('GET', url + '?' + util.buildQueryString(filters), null, true, 200, 'OK', function (xhr) {
						result = util.tryJSONParse(xhr.responseText);
						if (ok(result.statements.length==1, "expected a statement to be returned, should have been the statement saved (with context parameter + object activity)")) 
							equal(result.statements[0].id, statement.id, 'found saved statement with context parameter + object activity');

						start();
					
					});
				});
			});
		});
	});
});

asyncTest('GET statements (via POST), all filters', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/';


    var actorParam = encodeURIComponent(JSON.stringify(env.statement.actor));

	util.request('POST', url, 'limit=10&actor='+actorParam, true, 200, 'OK', function (xhr) {
		var statements = util.tryJSONParse(xhr.responseText).statements,
			statement,
			filters = {};

		if (statements !== undefined && statements.length >= 10) {
			// pick a statement with statements stored before & after
			statement = statements[5];

			// add filters which match the selected statement
            var sinceDate = util.DateFromISOString(statement.stored);
			filters.since = util.ISODateString(new Date(sinceDate.getTime() - 1));
			filters.until = statement.stored;
			filters.verb = statement.verb;
			filters.object = JSON.stringify(statement.object, null, 4);
			if (statement.context !== undefined && statement.context.registration !== undefined) {
				filters.registration = statement.context.registration;
			}
			filters.actor = JSON.stringify(env.statement.actor, null, 4);

			util.request('POST', url, util.buildQueryString(filters), true, 200, 'OK', function (xhr) {
				var results = util.tryJSONParse(xhr.responseText).statements,
					ii,
					found = false;

				for (ii = 0; ii < results.length; ii++) {
					if (results[ii].id === statement.id) {
						found = true;
					}
					equal(results[ii].stored, statement.stored, 'stored');
					equal(results[ii].verb, statement.verb, 'verb');
					if (statement.object.id !== undefined) {
						// object is an activity
						equal(results[ii].object.id, statement.object.id, 'object');
					} else {
						// object is an actor
						ok(util.areActorsEqual(results[ii].object, statement.object), 'object');
					}
					if (statement.context !== undefined && statement.context.registration !== undefined) {
						equal(results[ii].context.registration, statement.context.registration, 'registration');
					}
					// actor comparison
					ok(util.areActorsEqual(results[ii].actor, statement.actor), 'actor');
				}
				ok(found, 'no statement found for filters: ' + JSON.stringify(filters, null, 4));
				start();
			});
		} else {
			ok(false, 'Test requires at least 10 existing statements ' + url + '?limit=10&actor='+actorParam);
			start();
		}
	});
});

asyncTest('GET, verb filter', function () {
	"use strict";
	var env = statementsEnv;
    var util = env.util;
    var url = '/statements/';
    var statement = util.clone(env.statement);

    var regId = util.ruuid();
    var firstId = util.ruuid();
    var secondId = util.ruuid();

    statement.context = { "registration" : regId };
	statement.verb = 'experienced';

    async.waterfall([
	    function(cb){
            //Put the first statement
            var myUrl = url + '?statementId=' + firstId;
            util.request('PUT', myUrl, JSON.stringify(statement), true, 204, 'No Content', function(){cb(null)});
        },
        function(cb){
            //Put the second statement, different verb...
	        statement.verb = 'attempted';
            var myUrl = url + '?statementId=' + secondId;
	        util.request('PUT', myUrl, JSON.stringify(statement), true, 204, 'No Content', function(){cb(null)});
        },
        function(cb){
            //Use verb filter to find the expected statement
		    util.request('GET', url + '?verb=attempted&registration='+regId+'&limit=1', null, true, 200, 'OK', 
                function (xhr) {
		        	var statements = JSON.parse(xhr.responseText).statements;
                    equal(statements.length, 1, 'returned a statement');
		        	equal(statements[0].verb, 'attempted', 'verb');
		        	equal(statements[0].id, secondId, 'returned statement id');
		        	cb(null);
		        });
        },
        //Start up the test runner again...
        start
	]);
});

asyncTest('GET, sparse == false', function () {
	"use strict";
    var env = statementsEnv;

    var actor = env.statement.actor;

    var regId = env.util.ruuid();
    var myActivityId = env.util.ruuid();
    var myActivityFull = { "id":myActivityId, "definition":{"name": { "en-US" : "My Tezzzt Activity"} } };
    var myActivitySparse = { "id":myActivityId };
    var statement1 = { 
        "actor":actor, 
        "verb":"imported", 
        "object":myActivityFull, 
        "context":{"registration":regId} 
    };
    var statement2 = { 
        "actor":actor, 
        "verb":"attempted", 
        "object":myActivitySparse, 
        "context":{"registration":regId} 
    };

    //Import the activity
    env.util.request('POST','/statements',JSON.stringify([statement1]), true, 200, 'OK', function(){
        //Attempt the activity (using sparse activity info)
        env.util.request('POST','/statements',JSON.stringify([statement2]), true, 200, 'OK', function(xhr){
            //Now get the statement that had sparse info
            var getUrl = '/statements?registration=' + regId + '&sparse=false';
            env.util.request('GET',getUrl, null, true, 200, 'OK', function(xhr){
                //Check to make sure the activity is filled in on both statements
                var statements = JSON.parse(xhr.responseText).statements;
                for(var i = 0; i < statements.length; i++){
                    var stmtObject = statements[i].object;
                    delete(stmtObject.objectType);
                    deepEqual(stmtObject, myActivityFull);
                }
                //Start up the test runner again...
                start();
            });
        });
    });
});

function getGolfStatement(id) {
	"use strict";
	var ii, util = statementsEnv.util;

	for (ii = 0; ii < util.golfStatements.length; ii++) {
		if (util.golfStatements[ii].object.id === id && util.golfStatements[ii].verb != "imported") {
			return util.golfStatements[ii];
		}
	}
	return null;
}

function verifyGolfDescendants(callback) {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements/',
		testActivity = { id : 'scorm.com/GolfExample_TCAPI' };

	util.request('GET', url + '?verb=imported&limit=1&object=' + encodeURIComponent(JSON.stringify(testActivity)), null, true, null, null, function (xhr) {
		if (xhr.status !== 200) {
			util.request('POST', url, JSON.stringify(getGolfStatement(testActivity.id), null, 4), true, 200, 'OK', function () {
				callback();
			});
		}
	});
}

// verify LRS can handle all supported actor types (agent & person)
asyncTest('ActorTypes', function() {
    var env = statementsEnv;
    var myStatementId = env.util.ruuid();
    var url = '/statements?statementId=' + myStatementId;
    var myStatement = {
        actor: env.statement.actor,
        id: myStatementId,
        verb: "attempted",
        object: env.statement.object,
        context: { instructor : 
        	{ objectType : "Agent",
        	  mbox: ["mailto:auto_tests_agent@example.scorm.com"],
        	  name: ["agent name"]}
        }
    };

	env.util.request('PUT', url, JSON.stringify(myStatement), true, 204, 'No Content', function () {
		env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
			env.util.validateStatement(xhr.responseText, myStatement, myStatementId);
			start();
		});
	});
        
});

asyncTest('Statements, context activities filter', function () {
	"use strict";
	var env = statementsEnv;
	var util = env.util;
	var url = '/statements';

	var testActivity = { id: 'com.scorm.golfsamples.interactions.playing_1'};

	var groupingId = 'scorm.com/GolfExample_TCAPI';
	var groupingFilter = encodeURIComponent(JSON.stringify({id : groupingId}));

    var parentId = 'scorm.com/GolfExample_TCAPI/GolfAssessment.html';
    var parentFilter = encodeURIComponent(JSON.stringify({id : parentId}));

    var otherId = "com.scorm.golfsamples.context_other";
    var otherFilter = encodeURIComponent(JSON.stringify({id : otherId}));

	// add statement to find
	var statement = util.clone(getGolfStatement(testActivity.id));
	statement.id = util.ruuid();
	statement.context.registration = statement.id;


    async.waterfall([
        function(cb){
            //Post all the golf statements (which include grouping and parent context activities)
	        //util.request('POST', url, JSON.stringify(golfStatements), true, 200, 'OK', function(){cb(null);});
            
            //Just rely on golf statements already posted in POST multiple test
            cb(null);
        },
        function(cb){
            //Put this extra, specific statement that we'll be looking for...
	        util.request('PUT', url + "?statementId=" + statement.id, JSON.stringify(statement, null, 4), true, 
                         204, 'No Content', function(){cb(null);});
        },
        function(cb){
            //Try to find statements on grouping activity, without context flag, should not be found...
            var thisUrl = url + '?registration=' + statement.context.registration + '&object=' + groupingFilter;
	    	util.request('GET', thisUrl, null, true, 200, 'OK', 
                 function (xhr) {
	    		    equal(JSON.parse(xhr.responseText).statements.length, 0, 'response, find by context, no context flag');
                    cb(null);
                 });
        },
        function(cb){
            //Now look for statements w/ grouping activity and context flag
            var thisUrl = url + '?registration=' + statement.context.registration + '&context=true&object=' + groupingFilter;
	   	    util.request('GET', thisUrl, null, true, 200, 'OK', 
                function (xhr) {
	    			var resultStatements = util.tryJSONParse(xhr.responseText).statements,
	    				resultStatement = resultStatements[0];
	    			if (resultStatement === undefined) {
	    				ok(false, 'statement not found using context filter (grouping activity)');
	    			} else {
	    				equal(resultStatement.id, statement.id, 'correct statement found using context filter (grouping activity)');
	    			}
                    cb(null);
                });
        },
        function(cb){
            //Now look for statements w/ parent activity and context flag
            var thisUrl = url + '?registration=' + statement.context.registration + '&context=true&object=' + parentFilter;
	   	    util.request('GET', thisUrl, null, true, 200, 'OK', 
                function (xhr) {
	    			var resultStatements = util.tryJSONParse(xhr.responseText).statements,
	    				resultStatement = resultStatements[0];
	    			if (resultStatement === undefined) {
	    				ok(false, 'statement not found using context filter (parent activity)');
	    			} else {
	    				equal(resultStatement.id, statement.id, 'correct statement found using context filter (parent activity)');
	    			}
                    cb(null);
                });
        },
        function(cb){
            //Now look for statements w/ "other" activity and context flag
            var thisUrl = url + '?registration=' + statement.context.registration + '&context=true&object=' + otherFilter;
	   	    util.request('GET', thisUrl, null, true, 200, 'OK', 
                function (xhr) {
	    			var resultStatements = util.tryJSONParse(xhr.responseText).statements,
	    				resultStatement = resultStatements[0];
	    			if (resultStatement === undefined) {
	    				ok(false, 'statement not found using context filter (other activity)');
	    			} else {
	    				equal(resultStatement.id, statement.id, 'correct statement found using context filter (other activity)');
	    			}
                    cb(null);
                });
        },
        //Start the next test
        start,
    ]);
});


asyncTest('voiding statements', function () {
	"use strict";
	var env = statementsEnv;
    var util = env.util;

    var statement = util.clone(env.statement);
    statement.id = util.ruuid();

    var voidingStatementId = util.ruuid();

    function issueVoidingStatement(statementId, statementIdToVoid, expectedCode, expectedText, callback){
        var stmt = {
            "id":statementId,
            "actor":env.statement.actor,
            "verb":"voided",
            "object":{ "objectType":"Statement", "id":statementIdToVoid }
        };
        var url = '/statements?statementId=' + stmt.id;
        util.request('PUT', url, JSON.stringify(stmt), true, expectedCode, expectedText, function(){callback(null);});
    }


    async.waterfall([
        function(cb){
            //Just put the first statement
            var url = '/statements?statementId=' + statement.id;
	        util.request('PUT', url, JSON.stringify(statement), true, 204, 'No Content', function(){ cb(null); });
        },
        function(cb){ 
            //Void that statement, should succeed
            issueVoidingStatement(voidingStatementId, statement.id, 204, 'No Content', cb); 
        },
        function(cb){
            //Make sure statement was really voided
            var url = '/statements?statementId=' + statement.id;
            util.request('GET', url, null, true, 200, 'OK', function(xhr){ 
                var response = util.tryJSONParse(xhr.responseText);
                equal(response.voided, true);
                cb(null);
            });
        },
        function(cb){
            //Make sure voiding statement is reported correctly
            var url = '/statements?statementId=' + voidingStatementId;
            util.request('GET', url, null, true, 200, 'OK', function(xhr){ 
                var response = util.tryJSONParse(xhr.responseText);
                ok(response.object !== undefined);
                if(response.object !== undefined){
                    equal(response.object.objectType, "Statement");
                    equal(response.object.id, statement.id);
                }
                cb(null);
            });
        },
        function(cb){ 
            //Voiding a statement that doesn't exist should result in 404
            issueVoidingStatement(util.ruuid(), util.ruuid(), 404, 'Not Found', cb);
        },
        function(cb){ 
            //Voiding a voiding statement should fail
            issueVoidingStatement(util.ruuid(), voidingStatementId, 400, 'Bad Request', cb); 
        },
        //Start up the next test
        start
    ]);
});


asyncTest('statement validation', function () {
	"use strict";
	var env = statementsEnv;
    var util = env.util;

    var statement = util.clone(env.statement);
    statement.id = util.ruuid();

    var statementJson = JSON.stringify(statement);

    var url = '/statements?statementId=' + statement.id;

    function assertBadStatement(statement, cb){
	    util.request('PUT', url, JSON.stringify(statement), true, 400, 'Bad Request', function(){ cb(null); });
    }

    async.waterfall([
        //Actually, null actors are allowed in 0.9 (but not 0.95)
        /*function(cb){
            //Blank actor
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.actor = null;
            assertBadStatement(stmtCopy, cb);
        },*/
        function(cb){
            //Blank verb
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.verb = null;
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Blank object
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.object = null;
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Actor with no IFPs
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.actor = { "objectType":"Agent", "name":["Unknown Actor"] };
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Actor with crappy account
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.actor.account = [{"accountServiceHomePage":"", "accountName":"dummy"}];
            assertBadStatement(stmtCopy, function(){
                stmtCopy.actor.account = [{"accountServiceHomePage":"http://example.org", "accountName":""}];
                assertBadStatement(stmtCopy, cb);
            });
        },
        function(cb){
            //Activity with no ID
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.object = {"objectType":"Activity"};
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Activities in context with no ID
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.context = {"contextActivities":{"parent":{"objectType":"Activity"}}};
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Instructor in context with no IFPs
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.context = {"instructor":{"objectType":"Agent", "name":["Unknown Actor"]}};
            assertBadStatement(stmtCopy, cb);
        },
        function(cb){
            //Bad date time
            var stmtCopy = JSON.parse(statementJson);
            stmtCopy.timestamp='trash';
            assertBadStatement(stmtCopy, cb);
        },
        //Start up the next test
        start
    ]);
});


/*asyncTest('Statements, descendants filter', function () {
	"use strict";
	var env = statementsEnv,
		util = env.util,
		url = '/statements',
		statement,
		testActivity = { id: 'com.scorm.golfsamples.interactions.playing_1'},
		ancestorId = 'scorm.com/GolfExample_TCAPI',
		ancestorFilter = encodeURIComponent(JSON.stringify({id : ancestorId}));

	// add statement to find
	statement = util.clone(getGolfStatement(testActivity.id));
	statement.id = util.ruuid();
	statement.context.registration = statement.id;

	//?limit=1&activity=' + encodeURIComponent(JSON.stringify(testActivity))
	// statement not found by ancestor w/o using 'descendant' flag
	util.request('POST', url, JSON.stringify(golfStatements), true, 200, 'OK', function (xhr) {
	    util.request('PUT', url + "?statementId=" + statement.id, JSON.stringify(statement, null, 4), true, 204, 'No Content', function () {
	    	util.request('GET', url + '?registration=' + statement.context.registration + '&object=' + ancestorFilter, null, true, 200, 'OK', function (xhr) {
	    		equal(JSON.parse(xhr.responseText).length, 0, 'response, find by ancestor no descendants flag');
	    		util.request('GET', url + '?registration=' + statement.context.registration + '&descendants=true&object=' + ancestorFilter, null, true, 200, 'OK', function (xhr) {
	    			var resultStatements = util.tryJSONParse(xhr.responseText),
	    				resultStatement = resultStatements[0];
	    			if (resultStatement === undefined) {
	    				ok(false, 'statement not found using descendant filter');
	    			} else {
	    				equal(resultStatement.id, statement.id, 'correct statement found using descendant filter');
	    			}
	    			start();
	    		});
	    	});
	    });
    });

	/*util.request('POST', url, 'limit=10', true, 200, 'OK', function (xhr) {
		var statements = util.tryJSONParse(xhr.responseText),
			statement,
			filters = {},
			prop,
			queryString = [];

		if (statements.length === 10) {
			// pick a statement with statements stored before & after
			statement = statements[5];

			// add filters which match the selected statement
			filters.since = (new Date(new Date(statement.stored).getTime() - 1)).toString();
			filters.until = statement.stored;
			filters.verb = statement.verb;
			filters.object = JSON.stringify(statement.object, null, 4);
			if (statement.registration !== undefined) {
				filters.registration = statement.registraiton;
			}
			filters.actor = JSON.stringify(statement.actor, null, 4);

			for (prop in filters) {
				if (filters.hasOwnProperty(prop)) {
					queryString.push(prop + '=' + encodeURIComponent(filters[prop]));
				}
			}

			util.request('GET', url + statement.id, null, true, 200, 'OK', function (xhr) {
				var results = util.tryJSONParse(xhr.responseText),
					ii,
					found = false;

				results = [results];

				for (ii = 0; ii < results.length; ii++) {
					if (results[ii].id === statement.id) {
						found = true;
					}
					equal(results[ii].stored, statement.stored, 'stored');
					equal(results[ii].verb, statement.verb, 'verb');
					if (statement.object.id !== undefined) {
						// object is an activity
						equal(results[ii].object.id, statement.object.id, 'object');
					} else {
						// object is an actor
						ok(util.areActorsEqual(results[ii].object, statement.object), 'object');
					}
					if (statement.registration !== undefined) {
						equal(results[ii].registration, statement.registration, 'registration');
					}
					// actor comparison
					ok(util.areActorsEqual(results[ii].actor, statement.actor), 'actor');
				}
				ok(found, 'find statement filters based on');
				start();
			});
		} else {
			ok(false, 'Test requires at least 10 existing statements');
			start();
		}
	});*/
/*});*/
