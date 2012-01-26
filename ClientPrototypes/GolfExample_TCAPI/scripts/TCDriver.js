var tc_lrs = TCDriver_GetLRSObject();
//alert(tc_lrs.actor);
//alert(JSON.stringify(tc_lrs));

function delay() {
	var xhr = new XMLHttpRequest();
	var url = window.location + '?forcenocache='+_ruuid();
	xhr.open('GET', url, false);
	xhr.send(null);
}

// Synchronous if callback is not provided (not recommended)
function XHR_request(url, method, data, auth, callback, ignore404) {
	"use strict";
	var xhr,
		finished = false,
		xDomainRequest = false,
		ieXDomain = false,
		title,
		ticks = ['/','-','\\','|'],
		urlparts = url.toLowerCase().match(/^(.+):\/\/([^:\/]*):?(\d+)?(\/.*)?$/),
		location = window.location,
		urlPort,
		result,
		until;

		
	xDomainRequest = (location.protocol.toLowerCase() !== urlparts[1] || location.hostname.toLowerCase() !== urlparts[2]);
	if (!xDomainRequest) {
		urlPort = (urlparts[3] === null ? ( urlparts[1] === 'http' ? '80' : '443') : urlparts[3]);
		xDomainRequest = (urlPort === location.port);
	}
	if (!xDomainRequest || typeof(XDomainRequest) === 'undefined') {
		xhr = new XMLHttpRequest();
	        xhr.open(method, url, (callback == true));
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Authorization", auth);

	} else {
		if ('post,get'.indexOf(method.toLowerCase()) < 0) {
			alert("Internet Explorer does not support cross domain requests with method: " + method );
			return "";
		}
		ieXDomain = true;
		xhr = new XDomainRequest();
	        xhr.open(method, url);
	}
	
	function requestComplete() {
	    if(!finished ) {
		// may be in sync or async mode, using XMLHttpRequest or IE XDomainRequest, onreadystatechange or
		// onload or both might fire depending upon browser, just covering all bases with event hooks and
		// using 'finished' flag to avoid triggering events multiple times
	    	finished = true;
		if (xhr.status === undefined || (xhr.status >= 200 && xhr.status < 300)) {
	    		if (callback) {
					callback(xhr.responseText);
	    		} else {
				result = xhr.responseText;
	    			return xhr.responseText;
	    		}
			} else if (!ignore404 || xhr.status != 404) {

				alert("There was a problem communicating with the Learning Record Store. (" + xhr.status + ")");
				throw new Error("debugger");
			}
		} else {
			return result;
		}
	};
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				requestComplete();
			}
		}
	        xhr.onload = requestComplete;
       		xhr.onerror = requestComplete;
	xhr.send(data);
	
	if (!callback) {
		// synchronous
		if (ieXDomain) {
			// synchronous call in IE, with no asynchronous mode available.
			until = 1000 + new Date();
			while (new Date() < until && xhr.readyState !== 4 && !finished) {
				delay();
			}
		}
		return requestComplete();
	}
}

function TCDriver_GetLRSObject(){
	var lrsProps = ["endpoint","auth","actor","registration","activity_id"];
	var lrs = new Object();
	
	for (var i = 0; i<lrsProps.length; i++){
		if (getQueryStringParam(lrsProps[i]) != ""){
			lrs[lrsProps[i]] = getQueryStringParam(lrsProps[i]);
		}
	}
    if(lrs.endpoint === undefined || lrs.endpoint == "" || lrs.auth === undefined || lrs.auth == ""){
        alert("Configuring TCDriver LRS Object from queryString failed");
        return null;
    }
	return lrs;
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_SendStatement (lrs, stmt, callback) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
        if(stmt.actor === undefined){
            stmt.actor = JSON.parse(lrs.actor);
        }
		XHR_request(lrs.endpoint+"statements/?statementId="+_ruuid(), "PUT", JSON.stringify(stmt), lrs.auth, callback);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_SendMultiStatements (lrs, stmtArray, callback) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
        for(var i = 0; i < stmtArray; i++){
            var stmt = stmtArray[i];
            if(stmt.actor === undefined){
                stmt.actor = JSON.parse(lrs.actor);
            }
        }
		XHR_request(lrs.endpoint+"statements/", "POST", JSON.stringify(stmtArray), lrs.auth, callback);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_SendState (lrs, activityId, stateKey, stateVal, callback) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		var url = lrs.endpoint + "activities/state?activityId=<activity ID>&actor=<actor>&stateId=<statekey>";
		
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<actor>',encodeURIComponent(lrs.actor));
		url = url.replace('<statekey>',encodeURIComponent(stateKey));
		
		XHR_request(url, "PUT", JSON.stringify(stateVal), lrs.auth, callback);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_GetState (lrs, activityId, stateKey, callback) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		var url = lrs.endpoint + "activities/state?activityId=<activity ID>&actor=<actor>&stateId=<statekey>";
		
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<actor>',encodeURIComponent(lrs.actor));
		url = url.replace('<statekey>',encodeURIComponent(stateKey));
		
		return XHR_request(url, "GET", null, lrs.auth, callback, true);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_SendActivityProfile (lrs, activityId, profileKey, profileStr, callback) {
	
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		var url = lrs.endpoint + "activities/<activity ID>/profile/<profilekey>";
		
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<profilekey>',encodeURIComponent(profileKey));
		
		XHR_request(url, "PUT", profileStr, lrs.auth, callback);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_GetActivityProfile (lrs, activityId, profileKey, callback) {
	
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		var url = lrs.endpoint + "activities/<activity ID>/profile/<profilekey>";
		
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<profilekey>',encodeURIComponent(profileKey));
		
		return XHR_request(url, "GET", null, lrs.auth, callback);
	}
}

// Synchronous if callback is not provided (not recommended)
function TCDriver_GetStatements (lrs,sendActor,verb,activityId, callback) {
	if (lrs.endpoint != undefined && lrs.endpoint != "" && lrs.auth != undefined && lrs.auth != ""){
		
		var url = lrs.endpoint + "statements/?sparse=false";
		if (sendActor){
			url += "&actor=" + encodeURIComponent(lrs.actor);
		}
		
		if (verb != null){
			url += "&verb=" + verb;
		}
		if (activityId != null){
			var obj = {id:activityId};
			url += "&object=" + encodeURIComponent(JSON.stringify(obj));
		}
	
	
		return XHR_request(url, "GET", null, lrs.auth, callback);
	}
}





/***************************
 Tin Can Statement  
****************************/
function TCStatement(lrsObj){
	this.lrs = lrsObj;
	this.actor = eval("(" + lrsObj.actor + ")");
	this.verb = null;
	this.object = null;
	return this;
}
TCStatement.prototype.SetValue = function(name,value){
	this[name] = value;
	return this;
};
TCStatement.prototype.GetStatement = function(){
	var stmt = new Object();
	for (var name in this)
	{
		if (name != "lrs"){
			stmt[name] = this[name];
		} 
		
	}
	return stmt;
};
TCStatement.prototype.Send = function() {
	TCDriver_SendStatement(this.lrs,this.GetStatement());
}



/***************************
 Tin Can Generic Object (for chaining, basically)
****************************/
function TCObject(){
	return this;
}
TCObject.prototype.SetValue = function(name,value){
	this[name] = value;
	return this;
};



/* Other Util functions  */
function getQueryStringParam( name )
{
	
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null ){
    return "";
  }else{
	return decodeURIComponent(results[1]);
  }
}

/*!
Excerpt from: Math.uuid.js (v1.4)
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
