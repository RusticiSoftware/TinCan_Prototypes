GolfExample = {};

GolfExample.CourseActivity = {
    id: "http://id.tincanapi.com/activity/tincan-prototypes/golf-example",
    definition: {
        type: "http://adlnet.gov/expapi/activities/course",
        name: {
            "en-US": "Golf Example - Tin Can Course"
        },
        description: {
            "en-US": "An overview of how to play the great game of golf."
        }
    }
};

GolfExample.getContext = function(parentActivityId, isAssessment) {
    isAssessment = typeof isAssessment !== 'undefined' ? isAssessment : false;
    var ctx = {
        contextActivities: {
            grouping: [
                {
                    id: GolfExample.CourseActivity.id
                },
                {
                    id: "http://id.tincanapi.com/activity/tincan-prototypes"
                }
            ],
            category: [
                 {
                    id: "http://id.tincanapi.com/recipe/tincan-prototypes/golf/1",
                    definition: {
                        type: "http://id.tincanapi.com/activitytype/recipe"
                    }
                },
                {
                    id: "http://id.tincanapi.com/activity/tincan-prototypes/elearning",
                    definition: {
                        type: "http://id.tincanapi.com/activitytype/source",
                        name: {
                            "en-US": "E-learning course"
                        },
                        description: {
                            "en-US": "An e-learning course built using the golf prototype framework."
                        }
                    }
                }
            ]
        }
    };
    if (parentActivityId !== undefined && parentActivityId !== null) {
        ctx.contextActivities.parent = {
            id: parentActivityId
        };
    }
    if (isAssessment){
        ctx.contextActivities.grouping.push({
            id: GolfExample.CourseActivity.id + "/GolfAssessment"
        });
    }
    return ctx;
};
