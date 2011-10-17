golfStatements = [
{
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI/GolfAssessment.html",
      "definition":{
         "name":"Golf Example Assessment",
         "description":"An Assessment for the Golf Example course.",
         "type":"Assessment",
         "children":[
            {
               "id":"com.scorm.golfsamples.interactions.playing_1",
               "definition":{
                  "type":"question",
                  "description":"The rules of golf are maintained by:",
                  "interaction_type":"choice",
                  "correct_responses":"USGA and Royal and Ancient"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.playing_2",
               "definition":{
                  "type":"question",
                  "description":"A score of two under par on a given hole is known as a(n):",
                  "interaction_type":"choice",
                  "correct_responses":"eagle"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.playing_3",
               "definition":{
                  "type":"question",
                  "description":"A typical golf course has ____ holes",
                  "interaction_type":"numeric",
                  "correct_responses":"18"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.playing_4",
               "definition":{
                  "type":"question",
                  "description":"In stableford scoring, the highest score wins.",
                  "interaction_type":"true-false",
                  "correct_responses":"true"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.playing_5",
               "definition":{
                  "type":"question",
                  "description":"Par for a 175 yard hole is typically:",
                  "interaction_type":"numeric",
                  "correct_responses":"3"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.etiquette_1",
               "definition":{
                  "type":"question",
                  "description":"When another player is attempting a shot, it is best to stand:",
                  "interaction_type":"choice",
                  "correct_responses":"Out of the player's line of sight"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.etiquette_2",
               "definition":{
                  "type":"question",
                  "description":"Generally sand trap rakes should be left outside of the hazard",
                  "interaction_type":"true-false",
                  "correct_responses":"true"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.etiquette_3",
               "definition":{
                  "type":"question",
                  "description":"The player with the best score on previous hole tees off:",
                  "interaction_type":"choice",
                  "correct_responses":"First"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.handicap_1",
               "definition":{
                  "type":"question",
                  "description":"Which formula is used to calculate the 'course handicap'?",
                  "interaction_type":"choice",
                  "correct_responses":"Course Handicap = Handicap index * Slope Rating / 113"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.handicap_2",
               "definition":{
                  "type":"question",
                  "description":"Golfer A has a course handicap of 6. Golfer B has a course handicap of 10. Golfer A shoots an 81. Golfer B shoots an 84. Golfer B wins the match be how many strokes?",
                  "interaction_type":"numeric",
                  "correct_responses":"1"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.handicap_3",
               "definition":{
                  "type":"question",
                  "description":"A 'scratch golfer' has a handicap of ___",
                  "interaction_type":"numeric",
                  "correct_responses":"0"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.handicap_4",
               "definition":{
                  "type":"question",
                  "description":"Golfer A has a course handicap of 3. Golfer B has a course handicap of 28. On the 6th handicap hole, how many strokes will Golfer A have to give Golfer B in match play?",
                  "interaction_type":"numeric",
                  "correct_responses":"2"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.fun_1",
               "definition":{
                  "type":"question",
                  "description":"To make friends on the golf course, you should play really slowly.",
                  "interaction_type":"true-false",
                  "correct_responses":"false"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.fun_2",
               "definition":{
                  "type":"question",
                  "description":"Knickers indicate a refined sense of style.",
                  "interaction_type":"true-false",
                  "correct_responses":"false"
               }
            },
            {
               "id":"com.scorm.golfsamples.interactions.fun_3",
               "definition":{
                  "type":"question",
                  "description":"You should take your score very seriously if you want to have a lot of fun on the course.",
                  "interaction_type":"true-false",
                  "correct_responses":"false"
               }
            }
         ]
      }
   }
},
{
   "verb":"imported",
   "object":{
      "id":"scorm.com/GolfExample_TCAPI",
      "definition":{
         "name":"Golf Example - Tin Can Course",
         "type":"Course",
         "description":"An overview of how to play the great game of golf.",
         "children":[
            {
               "id":"scorm.com/GolfExample_TCAPI/Playing/Par.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Playing/Scoring.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Playing/OtherScoring.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Playing/RulesOfGolf.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Etiquette/Course.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Etiquette/Distracting.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Etiquette/Play.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Handicapping/Overview.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Handicapping/CalculatingHandicap.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Handicapping/CalculatingScore.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/Handicapping/Example.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/HavingFun/HowToHaveFun.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/HavingFun/MakeFriends.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/HavingFun/HowToBeStylish.html"
            },
            {
               "id":"scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
         ]
      }
   }
},
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_3"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_2"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.fun_1"
        },
        "result": {
            "response": "false",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_4"
        },
        "result": {
            "response": "2",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_3"
        },
        "result": {
            "response": "0",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_2"
        },
        "result": {
            "response": "1",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.handicap_1"
        },
        "result": {
            "response": "Course Handicap = Handicap index * Slope Rating / 113",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_3"
        },
        "result": {
            "response": "First",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_2"
        },
        "result": {
            "response": "true",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.etiquette_1"
        },
        "result": {
            "response": "Out of the player's line of sight",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_5"
        },
        "result": {
            "response": "3",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_4"
        },
        "result": {
            "response": "true",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_3"
        },
        "result": {
            "response": "18",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_2"
        },
        "result": {
            "response": "eagle",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    },
    {
        "actor": {
            "mbox": "mailto:tincan@scorm.com",
            "name": "TinCan User"
        },
        "verb": "answered",
        "object": {
            "id": "com.scorm.golfsamples.interactions.playing_1"
        },
        "result": {
            "response": "USGA and Royal and Ancient",
            "success": true
        },
        "context": {
            "activity": {
                "id": "scorm.com/GolfExample_TCAPI/GolfAssessment.html"
            }
        }
    }
];