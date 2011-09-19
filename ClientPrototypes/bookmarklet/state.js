// verifies state API with a PUT of the current document title, followed by a GET
var url = "http://localhost:8080/TCAPI/activities/<activity ID>/state/<actor>/location";
var auth = "Basic dGVzdDpwYXNzd29yZA==";
var actor = {"mbox" : "mailto:learner@example.scorm.com", "name" : "Example Learner"};
var activityId = window.location.toString();


url = url.replace('<activity ID>',encodeURIComponent(activityId));
url = url.replace('<actor>',encodeURIComponent(JSON.stringify(actor)));

var xhr = new XMLHttpRequest();
xhr.open("PUT", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", auth);
xhr.onreadystatechange = function() {
	if(xhr.readyState == 4 ) {
		document.location = url;
	}
};
xhr.send(document.title);
