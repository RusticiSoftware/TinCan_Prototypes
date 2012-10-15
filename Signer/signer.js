var tc_driver = TCDriver_ConfigObject();
TCDriver_AddRecordStore(
    tc_driver,
    {
        endpoint: Config.endpoint,
        auth: 'Basic ' + Base64.encode(Config.authUser + ':' + Config.authPassword)
    }
);

function signTest() {
	var statement;
	var sHead = newline_toDos(window.document.getElementById("header").value);
	var sPayload;
	var sPemPrvKey = newline_toDos(window.document.getElementById("key").value);
	var statementId = "";

	var jws = new JWS();
	var sResult = null;
	var signed = {"actor": {
        "name": "Ben Clark",
        "mbox": "mailto:ben.clark@scorm.com",
        "objectType": "Agent"
    },
    "verb": { "id" : "http://tools.ietf.org/html/draft-ietf-jose-json-web-signature"},
"object" : {
"objectType":"StatementRef",
"id" : ""
},    	
    "result" : {"response" : ""}};

	try 
	{
		statementId = window.document.getElementById("statementId").value;
		statement = TCDriver_GetStatement(tc_driver,statementId);
	}
	catch (ex) {alert("Unable to load statement."); return;}
		window.document.getElementById("statement").textContent=JSON.stringify(JSON.parse(statement), null, 4);

	sPayload = newline_toDos(window.document.getElementById("statement").value);

	try {
		sResult = jws.generateJWSByP1PrvKey(sHead, sPayload, sPemPrvKey);
		window.document.getElementById("signature").value = sResult;
	} catch (ex) {
		alert("Error: " + ex);
		return;
	}	
	
	signed.result.response = sResult;
	signed.object.id = statementId;
	window.document.getElementById("signed").value = JSON.stringify(signed, null, 4);
	try {
		_TCDriver_XHR_request (tc_driver.recordStores[0], "statements?version=0.95", "post", window.document.getElementById("signed").value);	
	}
	catch (ex) {
		alert("Error: " + ex);
	}
}