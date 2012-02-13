var TCActive = false;

var actorName = "";
var actorEmail = "";

var gameId = "";

var GAME_ID = "scorm.com/JsTetris_TCAPI";

$(document).ready(function(){

	$('#activateTinCan').change(function(){
		if (!$(this).is(':checked')){
			TCActive = false;
			$('#tc_actorprompt').hide();
		} else {
			TCActive = true;
            if(tc_lrs !== undefined && tc_lrs.actor !== undefined){
                var actor = JSON.parse(tc_lrs.actor);
                actorName = actor.name[0];
                actorEmail = actor.mbox[0];
			    $('#tc_name').text(actorName);
			    $('#tc_email').text(actorEmail);
            }
			if (actorName == "" || actorEmail == ""){
				$('#tc_actorprompt').show();
			} else {
				$('#tc_actor').show();
			}
		}
	});

	$('#tc_submitActor').click(function(){
		if ($('#tc_nameInput').val() == "" || $('#tc_emailInput').val() == ""){
			alert("Please enter a name and an email.");
			return;
		} else {
			actorName = $('#tc_nameInput').val();
			actorEmail = $('#tc_emailInput').val();
			
			tc_lrs.actor = JSON.stringify({"name":[actorName], "mbox":["mailto:" + actorEmail]});
			
			$('#tc_name').text(actorName);
			$('#tc_email').text(actorEmail);
			
			$('#tc_actorprompt').hide();
			$('#tc_actor').show();
			
			if (tetris.puzzle){
				tc_sendStatment_StartNewGame();
			}
			
		}
		
	});
	
	$('#tc_changeactor').click(function(){
		$('#tc_actor').hide();
		$('#tc_actorprompt').show();
	});



});


function tc_getContext(registrationId){
    return {
        "contextActivities":{
            "grouping":{"id":GAME_ID}
        },
        "registration":registrationId
    };
}

function tc_sendStatementWithContext(stmt){
    stmt["context"] = tc_getContext(gameId);
    TCDriver_SendStatement(tc_lrs, stmt);
}

function tc_sendStatment_StartNewGame(){
	if (TCActive){
		gameId = _ruuid();
	
		var tcGameObj = {
            'id':GAME_ID,
			"definition":{
				"type":"media",
				"name":{"en-US":"Js Tetris - Tin Can Prototype"},
				"description":{"en-US":"A game of tetris."}
            }
        };

		var stmt = {
			"verb":"attempted",
			"object":tcGameObj
        };

        tc_sendStatementWithContext(stmt);
	}	
}

function tc_sendStatment_FinishLevel(level,time,apm,lines,score){
	if (TCActive){
		
		var tcGameObj = {
            "id":"scorm.com/JsTetris_TCAPI/level" + level,
			"definition":{
				"type":"media",
				"name":{"en-US":"Js Tetris Level" + level},
				"description":{"en-US":"Starting at 1, the higher the level, the harder the game."}
            }
        };

		var resultObj = {
            "extensions":{
                "time":time,
			    "apm":apm,
			    "lines":lines
            },
			"score":{
			    "raw":score,
			    "min":0
            }
        };
			
		var stmt = {
			"verb":"completed",
			"object":tcGameObj,
			"result":resultObj
        };

        tc_sendStatementWithContext(stmt);
	}	
}

function tc_sendStatment_EndGame(level,time,apm,lines,score){
	if (TCActive){
		
		var tcGameObj = {
            "id":GAME_ID,
			"definition":{
				"type":"media",
				"name":{"en-US":"Js Tetris - Tin Can Prototype"},
				"description":{"en-US":"A game of tetris."}
            }
        };

		var resultObj = {
            "score":{
				"raw":score,
				"min":0
            },
            "extensions":{
			    "level":level,
			    "time":time,
			    "apm":apm,
			    "lines":lines
            }
        };

		var stmt = {
			"verb":"completed",
			"object":tcGameObj,
			"result":resultObj
        };

        tc_sendStatementWithContext(stmt);

			
		//update high score
		var newScoreObj = {
            "actor":JSON.parse(tc_lrs.actor),
			"score":score,
			"date":TCDriver_ISODateString(new Date())
        };
		
        tc_addScoreToLeaderBoard(newScoreObj, 0);
	}	
}

function tc_addScoreToLeaderBoard(newScoreObj, attemptCount){
    if(attemptCount === undefined || attemptCount === null){
        attemptCount = 0;
    }
    if(attemptCount > 3){
        throw new Error("Could not update leader board");
    }
    
	tc_InitHighScoresObject();
	var highScorePos = tc_findScorePosition(HighScoresArray, 0, HighScoresArray.length-1, newScoreObj.score);
	if (highScorePos < 15){
		HighScoresArray.splice(highScorePos, 0, newScoreObj);
		if (HighScoresArray.length>15) HighScoresArray.pop();

        //Use this to respect concurrency control in profile API
        var lastSha1Hash = null;
        if(LastHighScoresStr !== null){
            var digestBytes = Crypto.SHA1(LastHighScoresStr, { asBytes: true });
            var lastSha1Hash = Crypto.util.bytesToHex(digestBytes);
        }

		TCDriver_SendActivityProfile(
            tc_lrs, GAME_ID, "highscores", 
            JSON.stringify(HighScoresArray),
            lastSha1Hash,
            function(xhr){
                //If we hit a conflict just try this whole thing again...
                if(xhr.status == 409 || xhr.status == 412){
                    tc_addScoreToLeaderBoard(newScoreObj, attemptCount+1);
                }
            });
	}
}

var HighScoresArray;
var LastHighScoresStr = null;

function tc_InitHighScoresObject(){
	var lrsHighScoresStr = TCDriver_GetActivityProfile(tc_lrs, GAME_ID, "highscores");
	if (lrsHighScoresStr === undefined || lrsHighScoresStr === null || lrsHighScoresStr == ""){
		HighScoresArray = new Array();
	} else {
        LastHighScoresStr = lrsHighScoresStr;
		HighScoresArray = JSON.parse(lrsHighScoresStr);
	}
}


function tc_findScorePosition(hsArray, start, end ,val){
	if (hsArray.length == 0) return 0;
	
	var insert = 1;
	var keepsearching = true;
	while (keepsearching){
		if (end - start == 0){
			insert = (val <= parseInt(hsArray[start].score))?start+1:start;
			keepsearching = false;
		} else if (end - start == 1) {
			if 	(val > parseInt(hsArray[start].score)){
				insert = start;
			} else if (val > parseInt(hsArray[end].score)){
				insert = end;
			} else {
				insert = end+1;
			}
			keepsearching = false;	
		} else {
			var mid = start + Math.ceil((end - start)/2);
			if (val <= parseInt(hsArray[mid].score)){
				start = mid;
			} else {
				end = mid
			}
		}
	}
	return insert;
}
	
	


