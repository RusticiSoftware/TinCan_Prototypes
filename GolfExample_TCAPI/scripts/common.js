GolfExample = { };

GolfExample.CourseActivity = {
    "id":"scorm.com/GolfExample_TCAPI",
    "definition":{
    	"type":"Course",
    	"name":{"en-US":"Golf Example - Tin Can Course"},
    	"description":{"en-US":"An overview of how to play the great game of golf."}
    }
};

GolfExample.getContext = function(parentActivityId){
    var ctx = {
        "contextActivities":{
            "grouping":{"id":GolfExample.CourseActivity.id}
        }
    };
    if(parentActivityId !== undefined && parentActivityId !== null){
        ctx.contextActivities["parent"] = {"id":parentActivityId};
    }
    return ctx;
};
