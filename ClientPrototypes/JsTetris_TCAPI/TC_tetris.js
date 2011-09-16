var TCActive = false;

var actorName = "";
var actorEmail = "";

var gameId = "";

tc_lrs.endpoint = "http://localhost:8080/TCAPI/Statements/";
tc_lrs.auth = "Basic dGVzdDpwYXNzd29yZA==";


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
	
		var tcGameObj = new TCObject().SetValue("id","scorm.com/JsTetris_TCAPI")
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
			.SetValue("registration",gameId)
			.SetValue("time",time)
			.SetValue("apm",apm)
			.SetValue("lines",lines)
			.SetValue("score",score);
			
		var stmt = new TCStatement(tc_lrs)
			.SetValue("verb","achieved")
			.SetValue("object",tcGameObj)
			.SetValue("context",contextObj)
			.Send();
	}	
}

function tc_sendStatment_EndGame(level,time,apm,lines,score){
	if (TCActive){
		
		var tcGameObj = new TCObject().SetValue("id","scorm.com/JsTetris_TCAPI")
			.SetValue("definition",new TCObject()
				.SetValue("name","Js Tetris - Tin Can Prototype")
				.SetValue("type","Game")
				.SetValue("description","A game of tetris."));
		var contextObj = new TCObject().SetValue("registration",gameId)
			.SetValue("level",level)
			.SetValue("time",time)
			.SetValue("apm",apm)
			.SetValue("lines",lines);
		var resultObj = new TCObject().SetValue("score",new TCObject()
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
