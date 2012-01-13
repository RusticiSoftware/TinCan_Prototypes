/* Global equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start */
/*jslint devel: true, browser: true, sloppy: false, maxerr: 50, indent: 4, plusplus: true */
var activityEnv = {};

module('Activities', {
	setup: function () {
		"use strict";
		Util.init(activityEnv);
	}
});

//PUT | GET | DELETE http://example.com/TCAPI/activities/<activity ID>/profile/<profile object key>
asyncTest('Profile', function () {
	"use strict";
	activityEnv.util.putGetDeleteStateTest(activityEnv, '/activities/profile?activityId=<activity ID>')
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition', function () {
	"use strict";
	var url = '/activities?activityId=<activity ID>',
		env = activityEnv;

	env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
		var activity_list = env.util.tryJSONParse(xhr.responseText);
        ok(activity_list.length > 0, "At least one activity returned");
        var activity = activity_list[0];
		equal(activity.id, env.util.activity.id, 'activity id');
		start();
	});
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition, multiple', function () {
	"use strict";
    var env = activityEnv;

    var myActivityId = env.util.ruuid();
    var myActivity = { "id":myActivityId };
    var myActivity_Plat1 = { "id":myActivityId, "platform":"iOS 5" };
    var myActivity_Rev1 = { "id":myActivityId, "revision":"1.0.1" };
    var myActivity_Plat1_Rev2 = { "id":myActivityId, "platform":"WIN32", "revision":"2.0.1" };
    var myActivities = [myActivity, myActivity_Plat1, myActivity_Rev1, myActivity_Plat1_Rev2];

    var myStatements = new Array();
    for(var i = 0; i < myActivities.length; i++){
        myStatements[i] = { "verb":"imported", "object":myActivities[i] };
    }

    //Import the activities
    env.util.request('POST','/statements',JSON.stringify(myStatements), true, 200, 'OK', function(){

        //Find the activities
	    var url = '/activities?activityId=' + myActivityId;
	    env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
	    	var activity_list = env.util.tryJSONParse(xhr.responseText);
            ok(activity_list.length == myActivities.length, "Correct number of activities returned");

            for(var i = 0; i < myActivities.length; i++){
                var found = false;
                for(var j = 0; j < activity_list.length; j++){

                    /*alert(JSON.stringify(myActivities[i]));
                    alert(JSON.stringify(activity_list[j]));
                    alert(activitiesAreEqual(myActivities[i], activity_list[j]));*/

                    if(activitiesAreEqual(myActivities[i], activity_list[j])){
                        found = true;
                        break;
                    }
                }
                ok(found, "Activity " + JSON.stringify(myActivities[i]) + " was in results");
            }

	    	start();
	    });
    })
});

//GET http://example.com/TCAPI/activities/<activity ID>
asyncTest('Definition, extensions', function () {
	"use strict";
	var env = activityEnv;

    var myActivityId = env.util.ruuid();
    var myActivity = { 
        id:myActivityId, 
        definition:{
            description:"Extensions Activity", 
            extensions:{
                extension_1:1,
                extension_2:{
                    obj:"test"} 
            }
        }
    };

    var myStatements = [{ verb: "imported", object: myActivity }];

    //Import activity through statement
    env.util.request('POST','/statements',JSON.stringify(myStatements), true, 200, 'OK', function(){
        //Get it
	    env.util.request('GET', "/activities?activityId=" + myActivityId, null, true, 200, 'OK', function (xhr) {
	    	var activity_list = env.util.tryJSONParse(xhr.responseText);
            ok(activity_list.length > 0, "At least one activity returned");
            var activity = activity_list[0];
            //Is is the same as we sent?
	    	deepEqual(activity, myActivity, 'persisted activity');
	    	start();
	    });
    });
});

//GET http://example.com/TCAPI/activities/<activity ID>/profile[?since=<timestamp>]
asyncTest('Profile, multiple', function () {
	"use strict";
	activityEnv.util.getMultipleTest(activityEnv, '/activities/profile?activityId=<activity ID>','profileId');
});

function activitiesAreEqual(activity1, activity2){
    if (activity1 == null && activity2 == null)
        return true;
    if (activity1 == null || activity2 == null)
        return false;

    return (activity1.id == activity2.id
               && activity1.revision == activity2.revision
               && activity1.platform == activity2.platform
               && activityDefinitionsAreEqual(activity1.definition, activity2.definition));
}

function activityDefinitionsAreEqual(def1, def2){
    return true;
    if(def1 == null && def2 == null)
        return true;
    if(def1 == null || def2 == null)
        return false;

    return def1.description == def2.description; //TODO: More to check for equality here...*/
}
