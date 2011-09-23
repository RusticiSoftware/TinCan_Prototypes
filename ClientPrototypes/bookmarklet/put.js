var url = "http://localhost:8080/TCAPI/Statements/"+_ruuid();
var auth = "Basic dGVzdDpwYXNzd29yZA==";
var statement = {actor:{"mbox" : "mailto:learner@example.scorm.com", "name" : "Example Learner"},
	verb:"",
	object:{id:"",definition:{}},
	};
var definition = statement.object.definition;

statement.verb='experienced';
statement.object.id = window.location.toString();
definition.title = document.title;
definition.type="Media";
definition.my_extension_activity_type="bookmarklet link";

var xhr = new XMLHttpRequest();
xhr.open("PUT", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", auth);
xhr.onreadystatechange = function() {
	if(xhr.readyState == 4 ) {
		if (xhr.status === 204) {
			window.open(url);
		} else {
			alert(xhr.status + " : " + xhr.responseText);
		}
	}
};
xhr.send(JSON.stringify(statement));

/*!
Modified from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
function _ruuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
 }
