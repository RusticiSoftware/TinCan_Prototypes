golfStatements = [
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/GolfAssessment.html",
      "definition":{
         "name": { "en-US" : "Golf Example Assessment" },
         "description": { "en-US" : "An Assessment for the Golf Example course." },
         "type":"Assessment"
      }
   }
},

{ 
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
    "verb":"imported",
    "object":{
        "id":"com.scorm.golfsamples.context_other"
    }
},

{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.playing_1",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "The rules of golf are maintained by:" },
         "interactionType":"choice",
         "correctResponsesPattern":["USGA"],
         "choices":[
            {"id":"UN", "description":{"en-US":"The UN"}},
            {"id":"USGA", "description":{"en-US":"USGA and Royal and Ancient"}},
            {"id":"PGA", "description":{"en-US":"The PGA"}},
            {"id":"course", "description":{"en-US":"Each course has it's own rules"}}
         ]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.playing_2",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "A score of two under par on a given hole is known as a(n):" },
         "interactionType":"choice",
         "correctResponsesPattern":["eagle"],
         "choices":[
            {"id":"opportunity", "description": {"en-US": "opportunity for improvement"}},
            {"id":"birdie", "description": {"en-US": "birdie"}},
            {"id":"double_bogie", "description": {"en-US": "double bogie"}},
            {"id":"eagle", "description": {"en-US": "eagle"}}
         ]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.playing_3",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "A typical golf course has ____ holes" },
         "interactionType":"numeric",
         "correctResponsesPattern":["18"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.playing_4",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "In stableford scoring, the highest score wins."},
         "interactionType":"true-false",
         "correctResponsesPattern":["true"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.playing_5",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Par for a 175 yard hole is typically:" },
         "interactionType":"numeric",
         "correctResponsesPattern":["3"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.etiquette_1",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "When another player is attempting a shot, it is best to stand:" },
         "interactionType":"choice",
         "correctResponsesPattern":["out_of_sight"],
         "choices":[
            {"id":"top_of_ball", "description":{"en-US":"On top of his ball"}}, 
            {"id":"line_of_fire", "description":{"en-US":"Directly in his line of fire"}}, 
            {"id":"out_of_sight", "description":{"en-US":"Out of the player's line of sight"}}
         ]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.etiquette_2",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Generally sand trap rakes should be left outside of the hazard" },
         "interactionType":"true-false",
         "correctResponsesPattern":["true"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.etiquette_3",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "The player with the best score on previous hole tees off:" },
         "interactionType":"choice",
         "correctResponsesPattern":["first"],
         "choices":[
            {"id":"putter", "description":{"en-US":"With a Putter"}},
            {"id":"first", "description":{"en-US":"First"}},
            {"id":"last", "description":{"en-US":"Last"}}
         ]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.handicap_1",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Which formula is used to calculate the 'course handicap'?"},
         "interactionType":"choice",
         "correctResponsesPattern":["choice_3"],
         "choices":[
            {"id":"choice_1", "description":{"en-US":"Course Handicap = Handicap index + number of holes * number of lost balls in last round"}},
            {"id":"choice_2", "description":{"en-US":"Course Handicap = Number of years experience / annual equipment spending"}},
            {"id":"choice_3", "description":{"en-US":"Course Handicap = Handicap index * Slope Rating / 113"}}
         ]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.handicap_2",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Golfer A has a course handicap of 6. Golfer B has a course handicap of 10. Golfer A shoots an 81. Golfer B shoots an 84. Golfer B wins the match be how many strokes?"},
         "interactionType":"numeric",
         "correctResponsesPattern":["1"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.handicap_3",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "A 'scratch golfer' has a handicap of ___"},
         "interactionType":"numeric",
         "correctResponsesPattern":["0"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.handicap_4",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Golfer A has a course handicap of 3. Golfer B has a course handicap of 28. On the 6th handicap hole, how many strokes will Golfer A have to give Golfer B in match play?"},
         "interactionType":"numeric",
         "correctResponsesPattern":["2"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.fun_1",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "To make friends on the golf course, you should play really slowly." },
         "interactionType":"true-false",
         "correctResponsesPattern":["false"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.fun_2",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "Knickers indicate a refined sense of style." },
         "interactionType":"true-false",
         "correctResponsesPattern":["false"]
      }
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"com.scorm.golfsamples.interactions.fun_3",
      "definition":{
         "type":"cmi.interaction",
         "description": { "en-US" : "You should take your score very seriously if you want to have a lot of fun on the course." },
         "interactionType":"true-false",
         "correctResponsesPattern":["false"]
      }
   }
},

{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI",
      "definition":{
         "name": { "en-US" : "Golf Example - Tin Can Course" },
         "type":"Course",
         "description": { "en-US" : "An overview of how to play the great game of golf." }
      }
   }
},

{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Playing/Par.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Playing/Scoring.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Playing/OtherScoring.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Playing/RulesOfGolf.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Etiquette/Course.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Etiquette/Distracting.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Etiquette/Play.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Handicapping/Overview.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Handicapping/CalculatingHandicap.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Handicapping/CalculatingScore.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/Handicapping/Example.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/HavingFun/HowToHaveFun.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/HavingFun/MakeFriends.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/HavingFun/HowToBeStylish.html"
   }
},
{
   "actor": {
       "mbox": ["mailto:tincan@scorm.com"],
       "name": ["TinCan User"]
   },
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/GolfAssessment.html"
   }
},

    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_3"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_2"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_1"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_4"
        },
        "result": {
            "response": "2",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_3"
        },
        "result": {
            "response": "0",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_2"
        },
        "result": {
            "response": "1",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_1"
        },
        "result": {
            "response": "choice_3",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_3"
        },
        "result": {
            "response": "first",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_2"
        },
        "result": {
            "response": "true",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_1"
        },
        "result": {
            "response": "out_of_sight",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_5"
        },
        "result": {
            "response": "3",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_4"
        },
        "result": {
            "response": "true",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_3"
        },
        "result": {
            "response": "18",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_2"
        },
        "result": {
            "response": "eagle",
            "success": true
        },
        "context":{
            "contextActivities": {
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" }
            }
        }
    },
    {
        "actor": {
            "mbox": ["mailto:tincan@scorm.com"],
            "name": ["TinCan User"]
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_1"
        },
        "result": {
            "response": "USGA",
            "success": true
        },
        "context":{
            "contextActivities": {
                "parent": { "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html" },
                "grouping": { "id": "scorm.com/GolfExample_TCAPI" },
                "other": {"id":"com.scorm.golfsamples.context_other"}
            }
        }
    }
];
