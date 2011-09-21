
var endpoint = "http://localhost:8080/TCAPI/";
var auth = "Basic dGVzdDpwYXNzd29yZA==";

google.load('visualization', '1.0', {'packages':['corechart']});

$(document).ready(function(){

	TC_GetStatements(25,null,null,RenderStatements);
	TC_GetActivityProfile ("scorm.com/JsTetris_TCAPI", "highscores", RenderHighScores);
	TC_GetStatements(0,"completed","scorm.com/JsTetris_TCAPI",RenderTetrisScoreChart);
	
	$('#refreshStatements').click(function(){
		$("#theStatements").empty();
		TC_GetStatements(25,null,null,RenderStatements);
	});
	$('#showAllStatements').click(function(){
		if (confirm("Are you sure?\nThis could take a while to load and could even make the system (and your browser) unresponsive. But it's up to you.")){
			$("#theStatements").empty();
			TC_GetStatements(0,null,null,RenderStatements);
		}
	});
	
	$("#refreshHighScores").click(function(){
		$("#tetrisHighScoreData").empty();
		TC_GetActivityProfile("scorm.com/JsTetris_TCAPI", "highscores", RenderHighScores);
		TC_GetStatements(0,"completed","scorm.com/JsTetris_TCAPI",RenderTetrisScoreChart);
	});
	

});



function TC_GetStatements (num,verb,activityId,callbackFunction) {
	var url = endpoint + "statements/?sparse=false";
	if (num > 0){
		url += "&limit=" + num;
	}
	if (verb != null){
		url += "&verb=" + verb;
	}
	if (activityId != null){
		var obj = {id:activityId};
		url += "&object=" + encodeURIComponent(JSON.stringify(obj));
	}
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("Get", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", auth);
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 ) {
             callbackFunction(xhr.responseText);
		}
	};
	xhr.send(null);
	
}

function RenderStatements(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var stmtStr = "<table>";
	
	var i;
	for (i = 0; i < statements.length ; i++){
		stmtStr += "<tr class='statement' tcid='" + statements[i].id + "'>";
		
		var dt = statements[i].stored.substr(0,19).replace("T"," ");//yyyy-MM-ddTHH:mm:ss
		stmtStr += "<td class='date'>"+ dt +"</td>";
		
		var name = (statements[i].actor.name != undefined) ? statements[i].actor.name : statements[i].actor.mbox;
		stmtStr += "<td> <span class='actor'>"+ name +"</span>";
		
		
		
		var obj = statements[i].object.id;
		if (statements[i].object.definition != undefined){
			if (statements[i].object.definition.type != undefined && statements[i].object.definition.type == "question"){
				obj = (statements[i].object.definition.description != undefined) ? statements[i].object.definition.description : obj;
				
				var answer = "";
				var corrAnswer = "";
				if (statements[i].result != undefined){
					if (statements[i].result.success != undefined){
						stmtStr += " <span class='score'>"+ ((statements[i].result.success)?"correctly":"incorrectly") +"</span>";
						if (!statements[i].result.success && statements[i].object.definition.correct_responses != undefined){
							corrAnswer = " The correct response is '" + statements[i].object.definition.correct_responses + "'.";
						}
					}
					if (statements[i].result.response != undefined){
						answer = " with response '" + statements[i].result.response + "'.";
					}
					
					
				}
				stmtStr += " <span class='verb'>"+ statements[i].verb +"</span>";
				stmtStr += " <span class='object'>'"+ obj +"'</span>";
				stmtStr += (answer != "")? answer : ".";
				stmtStr += corrAnswer;
				
			} else {
				stmtStr += " <span class='verb'>"+ statements[i].verb +"</span>";
				obj = (statements[i].object.definition.name != undefined) ? statements[i].object.definition.name : obj;
				stmtStr += " <span class='object'>"+ obj +"</span>";
			}
			
			
			
			
		}
		
		
		
		if (statements[i].result != undefined){
			if (statements[i].result.score != undefined && statements[i].result.score.raw != undefined){
				stmtStr += " with score <span class='score'>"+ statements[i].result.score.raw +"</span>";
			}
		}
		
		stmtStr += "</td></tr>";
		
		
	}
	stmtStr += "</table>";
	
	$("#theStatements").append(stmtStr);
}

function TC_GetActivityProfile (activityId, profileKey, callbackFunction) {
	
	
		var url = endpoint + "activities/<activity ID>/profile/<profilekey>";
		
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<profilekey>',encodeURIComponent(profileKey));
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Authorization", auth);
		xhr.onreadystatechange = function() {
		    if(xhr.readyState == 4 ) {
				if(xhr.status != 404 ) {
		       		callbackFunction(xhr.responseText);
				}
	     	}
		};
		xhr.send(null);
	
}

function RenderHighScores(scoresStr){
	var scores = eval('(' + scoresStr + ')');
	
	if (scores.length > 0){
		$("#tetrisHighScoreData").empty();
	}
	
	html = "<table>";

	for (var i = 0; i < scores.length ; i++){
		html += "<tr class='highScoreRow'><td class='scoreRank'>" + (i+1) + "</td>";
		
		var name = (scores[i].actor.name != undefined) ? scores[i].actor.name : scores[i].actor.mbox;
		html += " <td class='actor'>"+ name +"</td>";
		
		
		html += " <td class='score'>"+ scores[i].score +"</td>";
		
		var dt = scores[i].date.substr(0,19).replace("T"," ");//yyyy-MM-ddTHH:mm:ss
		html += " <td class='date'>"+ dt +"</td>";
		
		html += "</tr>";
		
		
	}
	html += "</table>";
	$("#tetrisHighScoreData").append(html);
}

function RenderTetrisScoreChart(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var playerScores = new Object();
	var players = new Array();
	var scores = new Array();
	var maxScore = 0;
	
	var i;
	for (i = 0; i < statements.length ; i++){
		var name = (statements[i].actor.name != undefined) ? statements[i].actor.name : statements[i].actor.mbox;
		var score = (statements[i].result != undefined 
			&& statements[i].result.score != undefined 
			&& statements[i].result.score.raw != undefined) ? statements[i].result.score.raw : 0;
		
		if (playerScores[name] != undefined){
			if (score > playerScores[name].score){
				playerScores[name].score = score;
				playerScores[name].count++;
				scores[playerScores[name].index] = score;
			} 
		} else {
			playerScores[name] = new Object();
			playerScores[name].score = score;
			playerScores[name].index = scores.push(score)-1;
			playerScores[name].count = 1;
			players.push(name);
		}
		 
	
	
	}
	var height = (players.length * 40) + 50;
	
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Player');
    data.addColumn('number', 'Score');
    data.addRows(players.length);
	for (i = 0; i < players.length;i++){
		data.setCell(i,0,players[i]);
		data.setCell(i,1,scores[i]);
	}

      // Set chart options
      var options = {'title':'Tetris Personal Best Scores',
                     'width':960,'height':height,
 					titleTextStyle: {fontSize: 14} };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.getElementById('tetrisScoresChart'));
      chart.draw(data, options);

	var gamesData = new google.visualization.DataTable();
	gamesData.addColumn('number', 'Games');
    gamesData.addColumn('number', 'Score');
	//gamesData.addColumn('string', 'Player');
	gamesData.addRows(players.length);
	for (i = 0; i < players.length;i++){
		gamesData.setCell(i,0,playerScores[players[i]].count);
		gamesData.setCell(i,1,playerScores[players[i]].score);
		//gamesData.setCell(i,2,players[i]);
	}
	
	var gamesOptions = {'title':'Tetris Games Played to achieve to High Score',
                    width:432,
					height:300,
					hAxis: {title: 'Games'},
					vAxis: {title: 'Score'},
					legend: 'none',
					titleTextStyle: {fontSize: 14} };

      // Instantiate and draw our chart, passing in some options.
      var gamesChart = new google.visualization.ScatterChart(document.getElementById('tetrisGamesScores'));
      gamesChart.draw(gamesData, gamesOptions);
	
}

