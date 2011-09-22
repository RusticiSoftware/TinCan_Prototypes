var TCActive = false;

var actorName = "";
var actorEmail = "";

var gameId = "";

//DEFAULT ENDPOINT AND AUTH INFO
tc_lrs.endpoint = "http://localhost:8080/TCAPI/";
tc_lrs.auth = "Basic dGVzdDpwYXNzd29yZA==";

var GAME_ID = "scorm.com/JsTetris_TCAPI";

$(document).ready(function(){

	$('#activateTinCan').change(function(){
		if (!$(this).is(':checked')){
			TCActive = false;
			$('#tc_actorprompt').hide();
		} else {
			TCActive = true;
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
			
			tc_lrs.actor = JSON.stringify(new TCObject().SetValue("name",actorName).SetValue("mbox","mailto:" + actorEmail));
			
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


function tc_sendStatment_StartNewGame(){
	if (TCActive){
		gameId = _ruuid();
	
		var tcGameObj = new TCObject().SetValue('id',GAME_ID)
			.SetValue("definition",new TCObject()
				.SetValue("name","Js Tetris - Tin Can Prototype")
				.SetValue("type","Game")
				.SetValue("description","A game of tetris."));
		var contextObj = new TCObject().SetValue("registration",gameId);
		var stmt = new TCStatement(tc_lrs)
			.SetValue("verb","played")
			.SetValue("object",tcGameObj)
			.SetValue("context",contextObj)
			.Send();
	}	
}

function tc_sendStatment_FinishLevel(level,time,apm,lines,score){
	if (TCActive){
		
		var tcGameObj = new TCObject().SetValue("id","scorm.com/JsTetris_TCAPI/level" + level)
			.SetValue("definition",new TCObject()
				.SetValue("name","Js Tetris Level" + level)
				.SetValue("type","Game")
				.SetValue("description","Starting at 1, the higher the level, the harder the game."));
		var contextObj = new TCObject().SetValue("activity",new TCObject().SetValue("id","scorm.com/JsTetris_TCAPI"))
			.SetValue("registration",gameId);
			
		var resultObj = new TCObject().SetValue("time",time)
			.SetValue("apm",apm)
			.SetValue("lines",lines)
			.SetValue("score",new TCObject()
				.SetValue("raw",score)
				.SetValue("min",0));
			
		var stmt = new TCStatement(tc_lrs)
			.SetValue("verb","achieved")
			.SetValue("object",tcGameObj)
			.SetValue("context",contextObj)
			.SetValue("result",resultObj)
			.Send();
	}	
}

function tc_sendStatment_EndGame(level,time,apm,lines,score){
	if (TCActive){
		
		var tcGameObj = new TCObject().SetValue("id",GAME_ID)
			.SetValue("definition",new TCObject()
				.SetValue("name","Js Tetris - Tin Can Prototype")
				.SetValue("type","Game")
				.SetValue("description","A game of tetris."));
		var contextObj = new TCObject().SetValue("registration",gameId);
		var resultObj = new TCObject().SetValue("score",new TCObject()
					.SetValue("raw",score)
					.SetValue("min",0))
				.SetValue("level",level)
				.SetValue("time",time)
				.SetValue("apm",apm)
				.SetValue("lines",lines);
		var stmt = new TCStatement(tc_lrs)
			.SetValue("verb","completed")
			.SetValue("object",tcGameObj)
			.SetValue("context",contextObj)
			.SetValue("result",resultObj)
			.Send();
			
		//update high score
		
		var newScoreObj =  new TCObject().SetValue("actor",eval("(" + tc_lrs.actor + ")"))
			.SetValue("score",score)
			.SetValue("date",new Date());
		
		tc_InitHighScoresObject();
		var highScorePos = tc_findScorePosition(HighScoresArray, 0, HighScoresArray.length-1 ,score);
		if (highScorePos < 15){
			HighScoresArray.splice(highScorePos,0,newScoreObj);
			if (HighScoresArray.length>15) HighScoresArray.pop();
			TCDriver_SendActivityProfile (tc_lrs, GAME_ID, "highscores", JSON.stringify(HighScoresArray));
		}
			
	}	
}

var HighScoresArray;
function tc_InitHighScoresObject(){
	if (HighScoresArray == undefined){
		var lrsHighScoresStr = TCDriver_GetActivityProfile (tc_lrs, GAME_ID, "highscores");
		if (lrsHighScoresStr == ""){
			HighScoresArray = new Array();
		} else {
			HighScoresArray = eval("(" + lrsHighScoresStr + ")");
		}
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
	
	


