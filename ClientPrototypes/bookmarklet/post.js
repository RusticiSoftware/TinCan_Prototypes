
var url = "http://localhost:8080/TCAPI/Statements/";
var auth = "Basic dGVzdDpwYXNzd29yZA==";
var statement = {actor:{"mbox" : "mailto:learner@example.scorm.com"},verb:"",object:{id:"",definition:{}}};
var definition = statement.object.definition;

statement.verb='experienced';
statement.object.id = window.location.toString();
definition.title = document.title;
definition.type="Media";
definition.my_extension_activity_type="bookmarklet link";

var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", auth);
xhr.onreadystatechange = function() {
	if(xhr.readyState == 4 ) {
		alert(xhr.status + " : " + xhr.responseText);
	}
};
request = JSON.stringify(statement);

/*+",";
statement.verb = 'failed';
request += JSON.stringify(statement)+",";
statement.verb = 'passed';
request += JSON.stringify(statement)+"]";
*/

xhr.send(request);
