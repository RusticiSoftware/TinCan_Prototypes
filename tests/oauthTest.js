function authorize(preAuth) {
	var message, accessor, parameterMap, util, xhr;
	util = new Util();
	
	if (!preAuth) {
		window.auth = {type: "oAuth", consumerKey : Config.testConsumer.consumerKey, consumerSecret : Config.testConsumer.consumerSecret};
	}

	util.request("POST", "OAuth/initiate?oauth_callback=oob", null, window.auth, null, null, function(xhr) {
		var authPage;
		util.log("status: " + status);
		if (xhr.status === 200) {
			util.parseQueryString(xhr.responseText, window.auth);
		} else {
			alert ("(Initiate) Error: " + xhr.status + " ; " + xhr.responseText);
			return;
		}
		
		util.log(JSON.stringify(auth, null, 4));
		
		authPage = Config.endpoint + "OAuth/authorize?oauth_token=" + window.auth.oauth_token;
		window.open(authPage);
	});
}
function run() {
	var message, accessor, parameterMap, util, xhr;
	util = new Util();
	

	if (window.auth.oauth_verifier == undefined) {
		window.auth.oauth_verifier = window.document.getElementById('validation').value;
	}
	
	util.request("POST", "OAuth/token", null, window.auth, null, null, function(xhr) {
		util.log("status: " + status);
		if (xhr.status === 200) {
			util.parseQueryString(xhr.responseText, window.auth);
		} else {
			alert ("Error: " + xhr.status + " ; " + xhr.responseText);
			return;
		}
		
		util.log(JSON.stringify(window.auth, null, 4));
		window.open("tests.html?auth=" + encodeURIComponent(JSON.stringify(window.auth))); 
	});
}

function consumer() {
	var util, xhr;
	util = new Util();
	
	window.auth = {type: "oAuth", consumerKey : Config.testConsumer.consumerKey, consumerSecret : Config.testConsumer.consumerSecret};

	//util.request("GET","statements?limit=1", null, window.auth, null, null, function(xhr){
		//alert(xhr.status + " : " + xhr.responseText);
	//});
	window.open("tests.html?auth=" + encodeURIComponent(JSON.stringify(window.auth))); 
}

function user() {
	window.auth = {type: "oAuth", consumerKey : Config.testUnregisteredConsumer.consumerKey, consumerSecret : Config.testUnregisteredConsumer.consumerSecret,
	 consumer_name : Config.testUnregisteredConsumer.consumer_name};

	 authorize(true);
}