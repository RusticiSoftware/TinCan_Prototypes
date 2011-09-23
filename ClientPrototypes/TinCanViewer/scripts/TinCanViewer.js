
var endpoint = "http://localhost:8080/TCAPI/";
var auth = "Basic dGVzdDpwYXNzd29yZA==";

google.load('visualization', '1.0', {'packages':['corechart']});

$(document).ready(function(){

	TC_GetStatements(25,null,null,RenderStatements);
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
	
	TC_GetActivityProfile ("scorm.com/JsTetris_TCAPI", "highscores", RenderHighScores);
	TC_GetStatements(0,"completed","scorm.com/JsTetris_TCAPI",RenderTetrisScoreChart);
	$("#refreshHighScores").click(function(){
		$("#tetrisHighScoreData").empty();
		TC_GetActivityProfile("scorm.com/JsTetris_TCAPI", "highscores", RenderHighScores);
		TC_GetStatements(0,"completed","scorm.com/JsTetris_TCAPI",RenderTetrisScoreChart);
	});
	
	TC_GetStatements(0,null,"scorm.com/GolfExample_TCAPI",RenderGolfData);
	RequestGolfQuestions();
	$("#refreshGolfData").click(function(){
		$("#golfCourseData").empty();
		TC_GetStatements(0,null,"scorm.com/GolfExample_TCAPI",RenderGolfData);
		$(".golfQuestion").remove();
		RequestGolfQuestions();
	});
	
	
	TC_GetStatements(0,null,"scorm.com/Course/NashvilleMuseumsTour",RenderLocationData);
	RequestLocations();
	$('#refreshLocationCourseData').click(function(){
		$("#locationCourseData").empty();
		TC_GetStatements(0,null,"scorm.com/Course/NashvilleMuseumsTour",RenderLocationData);
		$(".locationRow").remove();
		RequestLocations();
	});
	

	
	$('#deleteAllData').click(function(){
		if (confirm('Are you sure you wish to clear ALL of your LRS data?')){
			TC_DeleteLRS();
			
		}
		
		
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

function TC_DeleteLRS(){

	var url = endpoint;
	
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", url, false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", auth);
	xhr.send(null);
	
	window.location = window.location;
}

function RenderStatements(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var stmtStr = "<table>";
	
	var i;
	for (i = 0; i < statements.length ; i++){
		stmtStr += "<tr class='statement' tcid='" + statements[i].id + "'>";
		
		//var dt = statements[i].stored.substr(0,19).replace("T"," ");//yyyy-MM-ddTHH:mm:ss
		var dt = new Date(statements[i].stored);
		stmtStr += "<td class='date'>"+ dt.toLocaleDateString() + " " + dt.toLocaleTimeString() +"</td>";
		
		var name = (statements[i].actor.name != undefined) ? statements[i].actor.name : statements[i].actor.mbox;
		stmtStr += "<td > <span class='actor'>"+ name +"</span>";
		
		
		
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
				
			} else if (statements[i].verb == "experienced" && statements[i].object.definition.type != undefined && statements[i].object.definition.type == "Location"){
				
				stmtStr += " <span class='verb'>visited</span>";
				obj = (statements[i].object.definition.name != undefined) ? statements[i].object.definition.name : obj;
				stmtStr += " <span class='object'>"+ obj +"</span>";
				
				if (statements[i].context.latitude != null && statements[i].context.longitude != null){
					stmtStr += " (latitude: "+ statements[i].context.latitude +", longitude: " + statements[i].context.longitude + ")";
				}
			
			
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
		stmtStr += "<div class='tc_rawdata' tcid_data='" + statements[i].id + "'><pre>" + JSON.stringify(statements[i], null, 4) + "</pre></div>";
		
		stmtStr += "</td></tr>";
		
		
		
	}
	stmtStr += "</table>";
	
	$("#theStatements").append(stmtStr);
	$('tr[tcid]').click(function(){
		$('[tcid_data="' + $(this).attr('tcid') + '"]').toggle();
	})
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

function RenderGolfData(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var html = "<table><tr class='labels'>";
	html += "<td class='name'>Learner</td>";
	html += "<td class='completion'>Completion</td>";
	html += "<td class='score'>Score</td>";
	html += "</tr>";
	
	var learners = new Array();
	var learnerObjs = new Object();
	
	var i;
	for (i = 0; i < statements.length ; i++){
		var l;
		var mbox = statements[i].actor.mbox;
		if (learnerObjs[mbox] == undefined){
			learners.push(mbox);
			learnerObjs[mbox] = new Object()
			learnerObjs[mbox].complete = 'incomplete';
			learnerObjs[mbox].score = '-';
		}
		if (learnerObjs[mbox].name == undefined || learnerObjs[mbox].name == mbox)
			learnerObjs[mbox].name = (statements[i].actor.name != undefined) ? statements[i].actor.name : mbox;
	
		if (statements[i].verb == "completed"){
			//l.score = statements[i].result.score.raw;
			learnerObjs[mbox].complete = 'complete';
		}
	
	}
	for (var j in learners){
		var l = learnerObjs[learners[j]];
		html += "<tr>";
		html += "<td class='name'>" + l.name + "</td>";
		html += "<td class='completion " + l.complete + "'>" + l.complete + "</td>";
		html += "<td class='score' mbox='" + learners[j] + "'>" + l.score + "</td>";
		
		html += "<tr>";
		
	}
	html += "</table>";
	
	$("#golfCourseData").append(html);
	TC_GetStatements(0,'completed',"scorm.com/GolfExample_TCAPI/GolfAssessment.html",RenderGolfDataScores);
	
}

function RenderGolfDataScores(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var i;
	for (i = 0; i < statements.length ; i++){
		var mbox = statements[i].actor.mbox;
		
		$('.score[mbox="' + mbox + '"]').text(statements[i].result.score.raw);
		
	}
	
}

function RequestGolfQuestions(){
	var questions = ["com.scorm.golfsamples.interactions.playing_1",
					"com.scorm.golfsamples.interactions.playing_2",
					"com.scorm.golfsamples.interactions.playing_3",
					"com.scorm.golfsamples.interactions.playing_4",
					"com.scorm.golfsamples.interactions.playing_5",
					"com.scorm.golfsamples.interactions.etiquette_1",
					"com.scorm.golfsamples.interactions.etiquette_2",
					"com.scorm.golfsamples.interactions.etiquette_3",
					"com.scorm.golfsamples.interactions.handicap_1",
					"com.scorm.golfsamples.interactions.handicap_2",
					"com.scorm.golfsamples.interactions.handicap_3",
					"com.scorm.golfsamples.interactions.handicap_4",
					"com.scorm.golfsamples.interactions.fun_1",
					"com.scorm.golfsamples.interactions.fun_2",
					"com.scorm.golfsamples.interactions.fun_3"];
	
	for (var i = 0; i < questions.length ; i++){
		TC_GetStatements(0,'answered',questions[i],RenderGolfQuestions);
	}
	
}
function RenderGolfQuestions(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	if (statements.length > 0){
		var html = "<tr class='golfQuestion'>";
	
		var q = statements[0];
		html += "<td class='question'>" + q.object.definition.description + "</td>";
		html += "<td class='correctAnswer'>" + q.object.definition.correct_responses + "</td>";
	
		
		var correct = 0;
		var incorrect = 0;
		var i;
		for (i = 0; i < statements.length ; i++){
			if (statements[i].result.success){
				correct++;
			} else {
				incorrect++;
			}
		
		}
		html += "<td class='metric'>" + statements.length + "</td>";
		html += "<td class='metric'>" + correct + "</td>";
		html += "<td class='metric'>" + incorrect + "</td>";
		
		html += "</tr>";
	
		$("table#golfQuestions").append(html);
	}
}

function RenderLocationData(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	var html = "<table><tr class='labels'>";
	html += "<td class='name'>Learner</td>";
	html += "<td class='completion'>Completion</td>";
	html += "</tr>";
	
	var learners = new Array();
	var learnerObjs = new Object();
	
	var i;
	for (i = 0; i < statements.length ; i++){
		var l;
		var mbox = statements[i].actor.mbox;
		if (learnerObjs[mbox] == undefined){
			learners.push(mbox);
			learnerObjs[mbox] = new Object()
			learnerObjs[mbox].complete = 'incomplete';
		}
		if (learnerObjs[mbox].name == undefined || learnerObjs[mbox].name == mbox)
			learnerObjs[mbox].name = (statements[i].actor.name != undefined) ? statements[i].actor.name : mbox;
	
		if (statements[i].verb == "completed"){
			learnerObjs[mbox].complete = 'complete';
		}
	
	}
	for (var j in learners){
		var l = learnerObjs[learners[j]];
		html += "<tr>";
		html += "<td class='name'>" + l.name + "</td>";
		html += "<td class='completion " + l.complete + "'>" + l.complete + "</td>";
		
		html += "<tr>";
		
	}
	html += "</table>";
	
	$("#locationCourseData").append(html);
	
}

function RequestLocations(){
	var locations = ["scorm.com/Course/NashvilleMuseums/Parthenon",
					"scorm.com/Course/NashvilleMuseums/CountryMusicHallofFame",
					"scorm.com/Course/NashvilleMuseums/TheFrist",
					"scorm.com/Course/NashvilleMuseums/AdventureScienceCenter",
					"scorm.com/Course/NashvilleMuseums/Cheekwood"];
	
	for (var i = 0; i < locations.length ; i++){
		TC_GetStatements(0,null,locations[i],RenderLocations);
	}
	
}
function RenderLocations(statementsStr){
	var statements = eval('(' + statementsStr + ')');
	
	if (statements.length > 0){
		var html = "<tr class='locationRow'>";
	
		var q = statements[0];
		html += "<td class='location'>" + q.object.definition.name + "<br/>";
		html += "<span class='description'>" + q.object.definition.description + "</span></td>";
	
		html += "<td class='metric'>" + statements.length + "</td>";
		
		html += "</tr>";
	
		$("table#courseLocations").append(html);
	}
}

