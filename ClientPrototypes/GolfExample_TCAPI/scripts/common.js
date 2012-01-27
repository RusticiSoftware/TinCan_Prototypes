GolfExample = { }

GolfExample.CourseActivity = 
{
    "id":"scorm.com/GolfExample_TCAPI", 
    "definition":{
    	"name":"Golf Example - Tin Can Course",
    	"type":"Course",
    	"description":"An overview of how to play the great game of golf."
    }
}

GolfExample.getContext = function(parentActivityId){
    var ctx = {
        "contextActivities":{
            "grouping":{"id":GolfExample.CourseActivity.id}
        }
    };
    if(parentActivityId !== null){
        ctx.contextActivities["parent"] = {"id":parentActivityId};
    }
    return ctx;
}
