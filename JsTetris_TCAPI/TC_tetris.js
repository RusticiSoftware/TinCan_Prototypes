//TinCan.enableDebug();

var ROOT_ACTIVITY_ID = "http://id.tincanapi.com/activity/tincan-prototypes/tetris",
    tincan = new TinCan (
        {
            url: window.location.href,
            activity: {
                id: ROOT_ACTIVITY_ID
            }
        }
    ),
    TCActive = false,
    actorName = "",
    actorEmail = "",
    gameId = "",
    HighScoresActivityProfile = null,
    HighScoresArray;

$(document).ready(function () {
    $('#activateTinCan').change(
        function () {
            var actor;
            if (!$(this).is(':checked')) {
                TCActive = false;
                tc_sendStatement_Terminate();
                $('#tc_actorprompt').hide();
            }
            else {
                TCActive = true;
                tc_sendStatement_Initialize();
                if (typeof tincan !== "undefined" && tincan.actor !== null) {
                    actor = tincan.actor;
                    actorName = actor.name;
                    actorEmail = actor.mbox;
                    $('#tc_name').text(actorName);
                    $('#tc_email').text(actorEmail);
                }

                if (actorName === "" || actorEmail === "") {
                    $('#tc_actorprompt').show();
                }
                else {
                    $('#tc_actor').show();
                }
            }
        }
    );

    $('#tc_submitActor').click(
        function () {
            var actor;

            if ($('#tc_nameInput').val() === "" || $('#tc_emailInput').val() === "") {
                alert("Please enter a name and an email.");
                return;
            }

            tc_sendStatement_Terminate();

            actorName = $('#tc_nameInput').val();
            actorEmail = $('#tc_emailInput').val();

            tincan.actor = new TinCan.Agent(
                {
                    name: actorName,
                    mbox: actorEmail
                }
            );

            $('#tc_name').text(actorName);
            $('#tc_email').text(actorEmail);

            $('#tc_actorprompt').hide();
            $('#tc_actor').show();

            tetris.reset();

            tc_sendStatement_Initialize();
        }
    );

    $('#tc_changeactor').click(
        function () {
            $('#tc_actor').hide();
            $('#tc_actorprompt').show();
        }
    );

    $('#activateTinCan').click();
});

function tc_getContext (extensions, parent) {
    var context = {
        contextActivities: {
            grouping: [
                {
                    id: "http://id.tincanapi.com/activity/tincan-prototypes"
                },
                {
                    id: ROOT_ACTIVITY_ID
                }
            ],
            category: [
                 {
                    id: "http://id.tincanapi.com/recipe/tincan-prototypes/tetris/1",
                    definition: {
                        type: "http://id.tincanapi.com/activitytype/recipe"
                    }
                },
                {
                    id: "http://id.tincanapi.com/activity/tincan-prototypes/tetris-template",
                    definition: {
                        type: "http://id.tincanapi.com/activitytype/source"
                    }
                }
            ]
        }
    };
    if (typeof (extensions) !== "undefined") {
        context.extensions = extensions;
    }
    if (typeof (parent) !== "undefined") {
        console.log(parent);
        context.contextActivities.parent = [parent];
    }
    return context
}

function tc_getContextExtensions () {
    return {
        "http://id.tincanapi.com/extension/attempt-id": gameId
    };
}

function tc_sendStatementWithContext (stmt, extensions, parent) {
    stmt.context = tc_getContext(extensions, parent);

    tincan.sendStatement(stmt, function () {});
}

function tc_sendStatement_Initialize () {
    tc_sendStatementWithContext(
        {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/initialized",
                display: {
                    "en-US": "initialized"
                }
            },
            object: {
                id: ROOT_ACTIVITY_ID,
                definition: {
                    type: "http://activitystrea.ms/schema/1.0/game",
                    name: {
                        "en-US": "Js Tetris - Tin Can Prototype"
                    },
                    description: {
                        "en-US": "A game of tetris."
                    }
                }
            }
        }
    );
}

function tc_sendStatement_Terminate () {
    tc_sendStatementWithContext(
        {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/terminated",
                display: {
                    "en-US": "terminated"
                }
            },
            object: {
                id: ROOT_ACTIVITY_ID,
                definition: {
                    type: "http://activitystrea.ms/schema/1.0/game",
                    name: {
                        "en-US": "Js Tetris - Tin Can Prototype"
                    },
                    description: {
                        "en-US": "A game of tetris."
                    }
                }
            }
        }
    );
}

function tc_sendStatement_StartNewGame () {
    if (! TCActive) {
        return;
    }

    gameId = TinCan.Utils.getUUID();

    tc_sendStatementWithContext(
        {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/attempted",
                display: {
                    "en-US": "attempted"
                }
            },
            object: {
                id: ROOT_ACTIVITY_ID,
                definition: {
                    type: "http://activitystrea.ms/schema/1.0/game",
                    name: {
                        "en-US": "Js Tetris - Tin Can Prototype"
                    },
                    description: {
                        "en-US": "A game of tetris."
                    }
                }
            },
            result: {
                duration: "PT0S"
            }
        },
        tc_getContextExtensions()
    );
}

function tc_sendStatement_FinishLevel (level, time, apm, lines, score) {
    var extensions = {};

    if (! TCActive) {
        return;
    }

    extensions["http://id.tincanapi.com/extension/apm"] = apm;
    extensions["http://id.tincanapi.com/extension/tetris-lines"] = lines;

    tc_sendStatementWithContext(
        {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: {
                    "en-US": "completed"
                }
            },
            object: {
                id: ROOT_ACTIVITY_ID + "/levels/" + level,
                definition: {
                    type: "http://curatr3.com/define/type/level",
                    name: {
                        "en-US": "Js Tetris Level" + level
                    },
                    description: {
                        "en-US": "Starting at 1, the higher the level, the harder the game."
                    }
                }
            },
            result: {
                extensions: extensions,
                score: {
                    raw: score,
                    min: 0
                },
                duration: TinCan.Utils.convertMillisecondsToISO8601Duration(time*1000)
            }
        },
        tc_getContextExtensions(),
        {id: ROOT_ACTIVITY_ID}
    );
}

function tc_sendStatement_EndGame (level, time, apm, lines, score) {
    var extensions = {};

    if (! TCActive) {
        return;
    }

    extensions["http://id.tincanapi.com/extension/level"] = level;
    extensions["http://id.tincanapi.com/extension/apm"] = apm;
    extensions["http://id.tincanapi.com/extension/tetris-lines"] = lines;

    tc_sendStatementWithContext(
        {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: {
                    "en-US": "completed"
                }
            },
            object: {
                id: ROOT_ACTIVITY_ID,
                definition: {
                    type: "http://activitystrea.ms/schema/1.0/game",
                    name: {
                        "en-US": "Js Tetris - Tin Can Prototype"
                    },
                    description: {
                        "en-US": "A game of tetris."
                    }
                }
            },
            result: {
                score: {
                    raw: score,
                    min: 0
                },
                duration: TinCan.Utils.convertMillisecondsToISO8601Duration(time*1000),
                extensions: extensions
            }
        },
        tc_getContextExtensions()
    );

    // update high score
    tc_addScoreToLeaderBoard(
        {
            actor: {
                name: tincan.actor.toString(),
            },
            score: score,
            date: TinCan.Utils.getISODateString(new Date())
        },
        0
    );
}

function tc_addScoreToLeaderBoard (newScoreObj, attemptCount) {
    var highScorePos;

    if (typeof attemptCount === "undefined" || attemptCount === null){
        attemptCount = 0;
    }
    if (attemptCount > 3) {
        throw new Error("Could not update leader board");
    }

    tc_InitHighScoresObject();

    highScorePos = tc_findScorePosition(HighScoresArray, 0, HighScoresArray.length-1, newScoreObj.score);
    if (highScorePos < 15) {
        HighScoresArray.splice(highScorePos, 0, newScoreObj);

        if (HighScoresArray.length > 15) {
            HighScoresArray.pop();
        }

        tincan.setActivityProfile(
            "highscores",
            JSON.stringify(HighScoresArray),
            {
                lastSHA1: (HighScoresActivityProfile !== null ? HighScoresActivityProfile.etag : null),
                callback: function (err, xhr) {
                    // If we hit a conflict just try this whole thing again...
                    if (xhr.status === 409 || xhr.status === 412) {
                        tc_addScoreToLeaderBoard(newScoreObj, attemptCount + 1);
                    }
                }
            }
        );
    }
}

function tc_InitHighScoresObject () {
    var result = tincan.getActivityProfile("highscores");

    if (result.err === null && result.profile !== null && result.profile.contents !== null && result.profile.contents !== "") {
        HighScoresActivityProfile = result.profile;
        HighScoresArray = JSON.parse(result.profile.contents);
    }
    else {
        HighScoresArray = [];
    }
}

function tc_findScorePosition (hsArray, start, end , val) {
    var insert = 1,
        keepsearching = true
    ;
    if (hsArray.length === 0) {
        return 0;
    }

    while (keepsearching) {
        if (end - start === 0){
            insert = (val <= parseInt(hsArray[start].score)) ? start + 1 : start;
            keepsearching = false;
        }
        else if (end - start === 1) {
            if (val > parseInt(hsArray[start].score)) {
                insert = start;
            }
            else if (val > parseInt(hsArray[end].score)) {
                insert = end;
            }
            else {
                insert = end + 1;
            }
            keepsearching = false;
        }
        else {
            var mid = start + Math.ceil( (end - start) / 2 );
            if (val <= parseInt(hsArray[mid].score)) {
                start = mid;
            }
            else {
                end = mid;
            }
        }
    }
    return insert;
}
