var TCActive = false,
    actorName = "",
    actorEmail = "",
    gameId = "",
    GAME_ID = "scorm.com/JsTetris_TCAPI",
    tc_driver = TCDriver_ConfigObject(),
    HighScoresArray,
    LastHighScoresStr = null
;

$(document).ready(function () {
    $('#activateTinCan').change(
        function () {
            if (!$(this).is(':checked')) {
                TCActive = false;
                $('#tc_actorprompt').hide();
            }
            else {
                TCActive = true;
                if (tc_driver !== undefined && tc_driver.actor !== undefined) {
                    var actor = tc_driver.actor;
                    actorName = actor.name[0];
                    actorEmail = actor.mbox[0];
                    $('#tc_name').text(actorName);
                    $('#tc_email').text(actorEmail);
                }

                if (actorName === "" || actorEmail === ""){
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

            tc_driver.actor = {
                name: [ actorName ],
                mbox: [ "mailto:" + actorEmail ]
            };
            tc_driver.actorJSON = JSON.stringify(tc_driver.actor);

            $('#tc_name').text(actorName);
            $('#tc_email').text(actorEmail);

            $('#tc_actorprompt').hide();
            $('#tc_actor').show();

            if (tetris.puzzle){
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
    TCDriver_SendStatement(tc_driver, stmt);
}

function tc_sendStatment_StartNewGame () {
    if (! TCActive) {
        return;
    }

    gameId = __ruuid();

    tc_sendStatementWithContext(
        {
            verb: "attempted",
            object: {
                id: GAME_ID,
                definition: {
                    type: "media",
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
    if (! TCActive) {
        return;
    }

    tc_sendStatementWithContext(
        {
            verb: "completed",
            object: {
                id: "scorm.com/JsTetris_TCAPI/level" + level,
                definition: {
                    type: "media",
                    name: {
                        "en-US": "Js Tetris Level" + level
                    },
                    description: {
                        "en-US": "Starting at 1, the higher the level, the harder the game."
                    }
                }
            },
            result: {
                extensions: {
                    time: time,
                    apm: apm,
                    lines: lines
                },
                score: {
                    raw: score,
                    min: 0
                }
            }
        }
    );
}

function tc_sendStatment_EndGame (level, time, apm, lines, score) {
    if (! TCActive) {
        return;
    }

    tc_sendStatementWithContext(
        {
            verb: "completed",
            object: {
                id: GAME_ID,
                definition: {
                    type: "media",
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
                extensions:{
                    level: level,
                    time: time,
                    apm: apm,
                    lines: lines
                }
            }
        }
    );

    // update high score
    tc_addScoreToLeaderBoard(
        {
            actor: tc_driver.actor,
            score: score,
            date: TCDriver_ISODateString(new Date())
        },
        0
    );
}

function tc_addScoreToLeaderBoard (newScoreObj, attemptCount) {
    var highScorePos,
        // Use this to respect concurrency control in profile API
        lastSha1Hash = null,
        digestBytes
    ;

    if (attemptCount === undefined || attemptCount === null){
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

        if (LastHighScoresStr !== null){
            digestBytes = Crypto.SHA1(LastHighScoresStr, { asBytes: true });
            lastSha1Hash = Crypto.util.bytesToHex(digestBytes);
        }

        TCDriver_SendActivityProfile(
            tc_driver,
            GAME_ID,
            "highscores",
            JSON.stringify(HighScoresArray),
            lastSha1Hash,
            function (xhr) {
                // If we hit a conflict just try this whole thing again...
                if (xhr.status === 409 || xhr.status === 412) {
                    tc_addScoreToLeaderBoard(newScoreObj, attemptCount + 1);
                }
            }
        );
    }
}

function tc_InitHighScoresObject () {
    var lrsHighScoresStr = TCDriver_GetActivityProfile(tc_driver, GAME_ID, "highscores");

    if (lrsHighScoresStr === undefined || lrsHighScoresStr === null || lrsHighScoresStr === ""){
        HighScoresArray = [];
    }
    else {
        LastHighScoresStr = lrsHighScoresStr;
        HighScoresArray = JSON.parse(lrsHighScoresStr);
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
