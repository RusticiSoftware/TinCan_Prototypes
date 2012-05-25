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
		util.log("status: " + xhr.status);
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
	window.auth = {type: "oAuth", consumerKey : Config.testConsumer.consumerKey, consumerSecret : Config.testConsumer.consumerSecret};
	window.open("tests.html?auth=" + encodeURIComponent(JSON.stringify(window.auth)));
}

/*function custom() {
	var util, xhr, data;
	util = new Util();
	
	//data = "registration=7ced37e5%2Dd6dc%2D4f2e%2D9052%2D3650c27849af&Authorization=Basic%20Ojk5Mzg5MTViLWM0OTctNGE0Yy1iZGQwLTBlMjY3M2QwNDFkZA%3D%3D&Content%2DType=application%2Fjson&activityId=63y6ehUwD2D%5Fcourse%5Fid&externalConfig=&stateId=resume&externalRegistration=E3A4LTX5UBLKVC7NWEOMJTKMWIDNURR5RVWI5LH3ZCTYZUVMAZKBJFWJ44IJA52BBGUTVPWIX4T2XSABSIOBCGSEHQ7JI67E56RNR62CPISEDMILKNQ2OLGLAP3RBDVG4GZGK4FDJSD5S&actor=%7B%22mbox%22%3A%5B%22mailto%3Agpalmer%40articulate%2Ecom%22%5D%7D";
	data = "externalConfig=&stateId=resume&externalRegistration=E3A4LTX5UBLKVC7NWEOMJTKMWIDNURR5RVWI5LH3ZCTYZUVMAZKBJFWJ44IJA52BBGUTVPWIX4T2XSABSIOBCGSEHQ7JI67E56RNR62CPISEDMILKNQ2OLGLAP3RBDVG4GZGK4FDJSD5S&content=233870506040ts1001311k0101101111012110131100%7E2m2%7E271a9101001a1a3de1p8Qg00G0%5F%24fDg30118%5Fdefaultpn02%5Fbfe720118%5Fdefault00000010%7E261a9101001a1a2xtp8Qg00G0%5F%24fDg30118%5Fdefaultpn02mefe720118%5Fdefault000000100&actor=%7B%22mbox%22%3A%5B%22mailto%3Agpalmer%40articulate%2Ecom%22%5D%7D&Authorization=Basic%20UzlIVzZBTUZETzpEbjNLcEIxcHptaEQ5V3ZEVFVzRmk2SFQ2VW1aSVRraVowZmFyNjFn&registration=7ced37e5%2Dd6dc%2D4f2e%2D9052%2D3650c27849af&Content%2DType=application%2Fjson&activityId=63y6ehUwD2D%5Fcourse%5Fid";
	util.request("POST", "activities/state?method=PUT", data, false, null, null, function(xhr) {
		alert(xhr.status + " : " + xhr.responseText); 
	});
}*/


function user() {
	window.auth = {type: "oAuth", consumerKey : Config.testUnregisteredConsumer.consumerKey, consumerSecret : Config.testUnregisteredConsumer.consumerSecret,
	 consumer_name : Config.testUnregisteredConsumer.consumer_name};

	 authorize(true);
}