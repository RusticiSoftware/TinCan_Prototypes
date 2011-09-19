// simple launch link generator

var provider, link, params, actor 

provider = 'http://<your course>/';
actor = '{ "name" : "Project Tin Can", "mbox" : "mailto:tincan@scorm.com" }';
params = {
	endpoint : 'http://localhost:8080/TCAPI/',
	auth  : 'Basic dGVzdDpwYXNzd29yZA==',
	actor : actor
}
console.log(provider+'?'+require('querystring').stringify(params,'&','='));






