//TinCan.enableDebug();

var GAME_ID = "http://tincanapi.com/JsTetris_TCAPI",
    tincan = new TinCan (
        {
            url: window.location.href,
            activity: {
                id: GAME_ID
            }
        }
    ),
    TCActive = false,
    actorName = "",
    actorEmail = "",
    gameId = "",
    HighScoresActivityProfile = null,
    HighScoresArray
;

$(document).ready(function () {
    $('#activateTinCan').change(
        function () {
            var actor;
            if (!$(this).is(':checked')) {
                TCActive = false;
                $('#tc_actorprompt').hide();
            }
            else {
                TCActive = true;
                if (typeof tincan !== "undefined" && tincan.actor !== null) {
                    actor = tincan.actor;
                    actorName = actor.name;
                    actorEmail = actor.mbox;
                    $('#tc_name').text(actorName);
                    $('#tc_email').text(actorEmail);
                }

                if (actorName === "" || actorEmail === "") {
                    $('#tc_actorprompt').show();
                } else {
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

            if (tetris.puzzle) {
                tc_sendStatment_StartNewGame();
            }
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

function tc_getContext (registrationId) {
    return {
        contextActivities: {
            grouping: {
                id: GAME_ID
            }
        },
        registration: registrationId
    };
}

function tc_sendStatementWithContext (stmt) {
    stmt.context = tc_getContext(gameId);

    tincan.sendStatement(stmt, function () {});
}

function tc_sendStatment_StartNewGame () {
    if (! TCActive) {
        return;
    }

    gameId = TinCan.Utils.getUUID();

    tc_sendStatementWithContext(
        {
            verb: "http://adlnet.gov/expapi/verbs/attempted",
            object: {
                id: GAME_ID,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/media",
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

function tc_sendStatment_FinishLevel (level, time, apm, lines, score) {
    var extensions = {};

    if (! TCActive) {
        return;
    }

    extensions[GAME_ID + "/time"] = time;
    extensions[GAME_ID + "/apm"] = apm;
    extensions[GAME_ID + "/lines"] = lines;

    tc_sendStatementWithContext(
        {
            verb: "http://adlnet.gov/expapi/verbs/completed",
            object: {
                id: GAME_ID + "/level" + level,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/media",
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
                }
            }
        }
    );
}

function tc_sendStatment_EndGame (level, time, apm, lines, score) {
    var extensions = {};

    if (! TCActive) {
        return;
    }

    extensions[GAME_ID + "/level"] = level;
    extensions[GAME_ID + "/time"] = time;
    extensions[GAME_ID + "/apm"] = apm;
    extensions[GAME_ID + "/lines"] = lines;

    tc_sendStatementWithContext(
        {
            verb: "http://adlnet.gov/expapi/verbs/completed",
            object: {
                id: GAME_ID,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/media",
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
                extensions: extensions
            }
        }
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
