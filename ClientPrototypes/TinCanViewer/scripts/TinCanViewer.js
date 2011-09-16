
var endpoint = "http://localhost:8080/TCAPI/statements/";
var auth = "Basic dGVzdDpwYXNzd29yZA==";


$(document).ready(function(){

	TC_GetStatements(25,RenderStatements);
	
	$('#refreshStatements').click(function(){
		$("#theStatements").empty();
		TC_GetStatements(25,RenderStatements);
	});
	$('#showAllStatements').click(function(){
		if (confirm("Are you sure?\nThis could take a while to load and could even make the system (and your browser) unresponsive. But it's up to you.")){
			$("#theStatements").empty();
			TC_GetStatements(0,RenderStatements);
		}
	});
	
	

});



function TC_GetStatements (num,callbackFunction) {
	var url = endpoint;
	if (num > 0){
		url += num;
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
	
	var i;
	for (i = 0; i < statements.length ; i++){
		var stmtStr = "<div class='statement' tcid='" + statements[i].id + "'>";
		
		var dt = statements[i].stored.substr(0,19).replace("T"," ");//yyyy-MM-ddTHH:mm:ss
		stmtStr += " <span class='date'>"+ dt +"</span>";
		
		var name = (statements[i].actor.name != undefined) ? statements[i].actor.name : statements[i].actor.mbox;
		stmtStr += " <span class='actor'>"+ name +"</span>";
		
		stmtStr += " <span class='verb'>"+ statements[i].verb +"</span>";
		
		var obj = (statements[i].object.definition != undefined && statements[i].object.definition.name != undefined) ? statements[i].object.definition.name : statements[i].object.id;
		stmtStr += " <span class='object'>"+ obj +"</span>";
		
		if (statements[i].result != undefined){
			if (statements[i].result.score != undefined && statements[i].result.score.raw != undefined){
				stmtStr += " with score <span class='score'>"+ statements[i].result.score.raw +"</span>";
			}
		}
		
		stmtStr += "</div>";
		$("#theStatements").append(stmtStr);
		
	}
	
	
	
	
	
}