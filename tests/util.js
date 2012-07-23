//globals: equal, responseText, statement, ok, deepEqual, QUnit, module, asyncTest, Util, start, golfStatements, console
/*jslint bitwise: true, browser: true, plusplus: true, maxerr: 50, indent: 4 */
function Util() {
	"use strict";
	var ii;

	// depending on consumer, golfStatements many not be available, or needed
	if (typeof golfStatements !== "undefined") {
		this.golfStatements = JSON.parse(JSON.stringify(golfStatements)); // "clone"
		for (ii = 0; ii < this.golfStatements.length; ii++) {
			if (this.golfStatements[ii].actor) {
				this.golfStatements[ii].actor.mbox = this.actor.mbox;
				this.golfStatements[ii].actor.name = this.actor.name;
			}
			this.golfStatements[ii].id = this.ruuid();
		}
	}
}

Util.init = function (env) {
	"use strict";
	QUnit.config.testTimeout = Config.timeout;

	if (env.id === undefined) {
		// set up test to be shared accross tests (only once)
		env.util = new Util();
		env.id = env.util.ruuid();
		env.statement = {
			actor: {
                "objectType": "Person",
				"mbox": env.util.actor.mbox,
				"name": env.util.actor.name
			},
			verb: "experienced",
			object: {
				id: env.util.activity.id,
				definition: {}
			}
		};
		env.statement.object.definition.name = env.util.activity.definition.name;
	}
};

// sign the specified request, based on the specified oAuth information
Util.prototype.oAuthSign = function(url, method, data, auth) {
	var pairs, pair, parts, parameterMap, accessor, message, p, encodedParameter;
	
	if (auth.type !== "oAuth") {
		// not using oAuth, nothing to do
		return url;
	}
    message = { action: url
                  , method: method
                  , parameters: []
                  };	
	if (data !== null && data !== "") {
		pairs = data.split('&');
		this.log("request data: " + data + " (pairs: " + pairs.length + ")");
		for (pair in pairs) {
			parts = pairs[pair].split('=');
			if (parts.length === 2) { // && parts[0].substring(0, 6) == "oauth_") {
				this.log("request data pair: " + pairs[pair]);
				parts[1] = decodeURIComponent(parts[1]);
				message.parameters.push(parts);
			} else {
				// not valid oauth form data, don't include in signature 
				this.log("non-form data: " + pairs[pair]);
			}
		}
	}
	accessor = { consumerSecret : auth.consumerSecret};
	message.parameters.push(["oauth_consumer_key", auth.consumerKey]);
	if (auth.consumer_name != undefined) {
		message.parameters.push(["consumer_name", auth.consumer_name]);
	}
	if (auth.oauth_verifier) {
		message.parameters.push(["oauth_verifier", auth.oauth_verifier]);
	}
	if (auth.oauth_token != undefined) {
		message.parameters.push(["oauth_token", auth.oauth_token]);
		accessor.tokenSecret = auth.oauth_token_secret;
	}
	
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    this.log("base: " + OAuth.SignatureMethod.getBaseString(message));
    parameterMap = OAuth.getParameterMap(message.parameters);
    this.log("oAuth parameters -- " + JSON.stringify(parameterMap, null, 4));
    this.log("auth : " + JSON.stringify(auth, null, 4));
    
    // if URL has an empty query string, trim it out
    if (url.indexOf("?") === url.length - 1) {
    	url = url.substring(0, url.length - 1);
    }
    for (p in parameterMap) {
        if (p.substring(0, 6) == "oauth_" || p == "consumer_name")
        {
        	encodedParameter = p + "=" + encodeURIComponent(parameterMap[p]);
        	// only add parameters that are not already on the query string or in the form post
        	if (url.indexOf(encodedParameter) == -1 && (data == null || data.indexOf(encodedParameter) == -1)) {
            	url += (url.indexOf("?") > -1 ? "&" : "?") + encodedParameter;
            }
        }
    }
    this.log("url: " + url);
	return url;
};


Util.prototype.endpoint = Config.endpoint;
Util.prototype.actor = { mbox: ["mailto:auto_tests@example.scorm.com"], name: ["Auto Test Learner"]};
Util.prototype.verb = "experienced";
Util.prototype.activity = {id : "http://scorm.com/tincan/autotest/testactivity", definition : { name : { 'en-US' : 'Tin Can Auto Test Activity' } } };
Util.prototype.actorUniqueProps = ['mbox', 'account', 'openid', 'mbox_sha1sum', 'account'];

Util.prototype.areActorsEqual = function (source, target) {
	"use strict";
	var prop;

	for (prop in source) {
		if (source.hasOwnProperty(prop) && this.inList(prop, this.actorUniqueProps)) {
			if (source[prop] === target[prop] || JSON.stringify(source[prop]) === JSON.stringify(target[prop])) {
				return true;
			}
		}
	}

	return false;
};

Util.prototype.inList = function (test, list) {
	"use strict";
	var ii;
	for (ii = 0; ii < list.length; ii++) {
		if (test === list[ii] || (typeof test === 'object' && (JSON.stringify(test) === JSON.stringify(list[ii])))) {
			return true;
		}
	}
	return false;
};

Util.prototype.getIEModeRequest = function(method, url, headers, data, auth){
	var newUrl = url;
	
	//Everything that was on query string goes into form vars
    var formData = new Array();
    var qsIndex = newUrl.indexOf('?');
    if(qsIndex > 0){
        formData.push(newUrl.substr(qsIndex+1));
        newUrl = newUrl.substr(0, qsIndex);
    }

    //Method has to go on querystring, and nothing else
    newUrl = newUrl + '?method=' + method;
    
    //Headers
    if(headers !== null){
        for(var headerName in headers){
            formData.push(headerName + "=" + encodeURIComponent(headers[headerName]));
        }
    }

    //The original data is repackaged as "content" form var
    if(data !== null){
        formData.push('content=' + encodeURIComponent(data));
    }
    
    return {
    	"method":"POST",
    	"url": newUrl,
    	"headers":{},
    	"data":formData.join("&")
    };
};

Util.prototype.requestWithHeaders = function (method, url, headers, data, useAuth, expectedStatus, expectedStatusText, callback){
    this.request(method, url, data, useAuth, expectedStatus, expectedStatusText, callback, headers);
};

Util.prototype.request = function (method, url, data, useAuth, expectedStatus, expectedStatusText, callback, extraHeaders, retries) {
	"use strict";

	if (this.endpoint.substring(this.endpoint.length-1) === "/") {
		if (url.indexOf("/") === 0) {
			url = url.substring(1); // remove redundant '/'
		}
	}  else if (url.indexOf("/") !== 0) {
		// add missing '/'
		url = "/" + url;
	}

    //Fill in some stock params if we need to
    var actorKey = null;
    var formData = false;

	if (method === 'GET') {
		actorKey = JSON.parse(JSON.stringify(this.actor)); // "clone"
		delete actorKey.name; // remove name since it doesn't have the reverse functional property (not useful as part of the ID)
	} else {
		actorKey = this.actor;
	}
	url = url.replace('<activity ID>', encodeURIComponent(this.activity.id));
	url = url.replace('<actor>', encodeURIComponent(JSON.stringify(actorKey)));


    //Stop if we get data but can't send it
	if (method !== 'PUT' && method !== 'POST' && data !== null) {
		throw new Error('data not valid for method: ' + method);
	}


    //Figure out content type, and content length
    var contentType = "application/json";
    var contentLength = 0;
    if(data !== null){
        var isJson = true;
	    try { JSON.parse(data); } 
        catch (ex) { isJson = false; }

		if (isJson) {
			contentType = "application/json";
		} else if (data.indexOf(" ") > -1) {
			// spaces are invalid in "application/x-www-form-urlencoded", content type unknown
			contentType = "application/octet-stream";
		} else {
			contentType = "application/x-www-form-urlencoded";
			formData = true;
		}
        contentLength = data.length;
    }
    
    //Consolidate all the headers
    var headers = {};
    if(extraHeaders === undefined || extraHeaders['Content-Type'] === undefined){
        headers["Content-Type"] = contentType;
    }
    if(contentLength > 0){
        headers["Content-Length"] = contentLength;
    }
    if (useAuth) {
    	if (window.location.href.indexOf('auth=') > -1) {
    		useAuth = JSON.parse(this.parseQueryString(window.location.href.substring(window.location.href.indexOf('?') + 1)).auth);
    	}
    	if (useAuth.type !== "oAuth") {
			headers["Authorization"] = 'Basic ' + Base64.encode(Config.authUser + ':' + Config.authPass);   
		}
	}
    if(extraHeaders !== null){
        for(var headerName in extraHeaders){
            headers[headerName] = extraHeaders[headerName];
        }
    }
    var usingIEMode = false;

    //Make the request already!
    //Check to see if we should use "IE" mode
    if(window.XDomainRequest){
        usingIEMode = true;
        this.log("Using alternate IE mode for communication");

        //Pack up the original request into the "IE Mode" request
        var ieModeRequest = this.getIEModeRequest(method, url, headers, data, useAuth);

        //All requests in this mode are POST
        var xdr = new XDomainRequest();
        xdr.open(ieModeRequest.method, this.oAuthSign(this.endpoint + ieModeRequest.url, "post", ieModeRequest.data, useAuth));

        //Setup callbacks
	    xdr.onload = function () {
	    	if (expectedStatus !== undefined && expectedStatusText !== undefined && expectedStatus !== null && expectedStatusText !== null) {
	    		equal(expectedStatus.toString().substr(0,1), '2', expectedStatus.toString() + ' : ' + expectedStatusText, method + ': ' + url + ' (status)');
	    	}
	    	callback(xdr, usingIEMode);
	    };
	    xdr.onerror = function () {
	    	if (expectedStatus !== undefined && expectedStatusText !== undefined && expectedStatus !== null && expectedStatusText !== null) {
	    		notEqual(expectedStatus.toString().substr(0,1), '2', expectedStatus.toString() + ' : ' + expectedStatusText, method + ': ' + url + ' (status)');
	    	}
	    	callback(xdr, usingIEMode);
	    };

        //Contact
	    try {
	    	xdr.send(ieModeRequest.data);
	    } catch (ex) {
	    	ok(false, ex.toString());
	    	console.error(ex.toString());
	    	start();
	    }
        
            
    } 
    //Else we're using the normal CORS XHR built into modern browsers
    else {
    	var forceIE = Config.forceIEMode;
    	var ieModeRequest;
    	
    	if (forceIE) {
    		ieModeRequest = this.getIEModeRequest(method, url, headers, data, useAuth);
    	}
	    var xhr = new XMLHttpRequest();

		if (forceIE) {
			xhr.open("post", this.oAuthSign(this.endpoint + ieModeRequest.url, "post", ieModeRequest.data, useAuth), false);
		} else {
		    xhr.open(method, this.oAuthSign(this.endpoint + url, method, formData ? data : "", useAuth), false);
		}
		
        //Headers
        if (!forceIE) {
			for(var headerName in headers){
				xhr.setRequestHeader(headerName, headers[headerName]);
			}
		} else {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}

        //Setup callback
	    xhr.onreadystatechange = function () {
	    	if (xhr.readyState === 4) {
	    		if (retries == undefined) {
	    			if (Config.retries !== undefined) {
	    				retries = Config.retries;
	    			} else {
	    				retries = 3;
	    			}
	    		}
	    		// LRS internal errors (5xx) should be retried, may have a temporary failure.
	    		if (retries > 0 && xhr.status >= 500 && expectedStatus !== xhr.status) {
	    			var util = new Util();
	    			util.log('retrying: ' + url + ' : ' + xhr.status);
					setTimeout(function() {util.request(method, url, data, useAuth, expectedStatus, expectedStatusText, callback, extraHeaders, --retries)}, 100);
					return;
	    		}
	    		if (expectedStatus !== undefined && expectedStatusText !== undefined && expectedStatus !== null && expectedStatusText !== null) {
	    			equal(xhr.status.toString() + ' : ' + xhr.statusText, expectedStatus.toString() + ' : ' + expectedStatusText, method + ': ' + url + ' (status)');
	    		}
	    		callback(xhr);
	    	}
	    };

        //Contact
	    try {
	    	xhr.send(forceIE ? ieModeRequest.data : data);
	    } catch (ex) {
	    	ok(false, ex.toString());
	    	console.error(ex.toString());
	    	start();
	    }
    }
};

Util.prototype.validateStatement = function (responseText, statement, id) {
	"use strict";
	var responseObj;

	if (responseText.id != undefined) {
		responseObj = responseText;
	} else {
		responseObj = this.tryJSONParse(responseText);
	}

	if (responseObj.id == undefined) {
		ok(false, 'statement ID missing');
	}

	ok(responseObj.authority !== undefined, "LRS expected to add authority");
	equal(responseObj.id, id, "LRS expected to use specified ID");
	ok(responseObj.stored !== undefined, "LRS expected to add stored timestamp");
    ok(responseObj.timestamp !== undefined, "LRS expected to add timestamp field");

	// since LRS adds these values, comparison will fail if included
	if (statement.id == undefined) {
		delete responseObj.id;
	}
	delete responseObj.authority;
	delete responseObj.stored;
    if(statement.inProgress == undefined){
        delete responseObj.inProgress;
    }
    if(statement.timestamp == undefined){
        delete responseObj.timestamp;
    }
    if (statement.object && responseObj.object) {
		if(statement.object.objectType == undefined){
			delete responseObj.object.objectType;
		}
		if(statement.object.definition == undefined){
			delete responseObj.object.definition;
		}
	}    

    //Clean up extra info from returned context activities
    if(statement.context != undefined && statement.context.contextActivities != undefined){
        var ctxacts = statement.context.contextActivities;
        var ctxIds = ["parent","grouping","other"];
        for(var i = 0; i < ctxIds.length; i++){
            var ctxId = ctxIds[i];
            if(ctxacts[ctxId] !== undefined){
                var activity = ctxacts[ctxId];
                if(activity.objectType === undefined){
                    delete responseObj.context.contextActivities[ctxId].objectType;
                }
                if(activity.definition === undefined){
                    delete responseObj.context.contextActivities[ctxId].definition;
                }
            }
        }
    }

    if (responseObj.actor == undefined) {
    	ok(false, "Statements returned from LRS must always have an actor.");
    }else if (responseObj.actor.objectType == undefined) {
    	ok(false, "Statements returned from LRS must always have an actor objectType.");
    }
	// LRS will add actor if not supplied
	if (statement.actor == undefined) {
		delete responseObj.actor;
	}
    if(statement.actor != undefined && statement.actor.objectType == undefined){
        delete responseObj.actor.objectType;
    }

	deepEqual(responseObj, statement, "statement");
};

Util.prototype.getMultipleTest = function (env, url, idParamName) {
	"use strict";
	var testText = 'test test text : ' + env.id,
		urlKey;

    var sep = (url.indexOf('?') == -1 ? '?' : '&');
	urlKey = url + sep + idParamName + '=' + encodeURIComponent(env.id);

	env.util.request('PUT', urlKey + '[1]', testText, true, 204, 'No Content', function () {
		env.util.getServerTime(null, function (error, timestamp) {
			env.util.request('PUT', urlKey + '[2]', testText, true, 204, 'No Content', function () {
				url += '&since=' + encodeURIComponent(timestamp.toString());
				env.util.request('GET', url, null, true, 200, 'OK', function (xhr) {
					var ii, keys, found1, found2;
					keys = env.util.tryJSONParse(xhr.responseText);
					found1 = found2 = false;
					for (ii = 0; ii < keys.length; ii++) {
						if (keys[ii] === env.id + '[1]') {
							found1 = true;
						} else if (keys[ii] === env.id + '[2]') {
							found2 = true;
						}
					}
					ok(found2, 'Key added after timestamp returned');
					ok(!found1, 'Key added before timestamp not returned');
					start();
				});
			});
		});
	});
};

// get the server time, based on when the statement with the specified ID was stored.
// if no ID specified, store a new statement and get its time.
Util.prototype.getServerTime = function (id, callback) {
	"use strict";
	var statement = {},
		util = this;

	// if ID not specified, 
	if (id === null || id === undefined) {
		id = this.ruuid();
        statement.actor = this.actor;
		statement.verb = 'imported';
		statement.object = { id: "about:blank" };
		this.request('PUT', '/statements?statementId=' + encodeURIComponent(id), JSON.stringify(statement), true, null, null, function (xhr) {
			util.getServerTime(id, callback);
		});
		return;
	}

	this.request('GET', '/statements?statementId=' + encodeURIComponent(id), null, true, null, null, function (xhr) {
		callback(null, util.tryJSONParse(xhr.responseText).stored);
	});
};

Util.prototype.putGetDeleteStateTest = function (env, url) {
	"use strict";
	var testText = 'profile / state test text : ' + env.id,
		urlKey = url + "&profileId=" + encodeURIComponent(env.id);
		//urlKey = url.addFS() + env.id;

    var headers = {"Content-Type":"text/plain"};

	env.util.request('GET', urlKey, null, true, 404, 'Not Found', function () {
		env.util.requestWithHeaders('PUT', urlKey, headers, testText, true, 204, 'No Content', function () {
			env.util.request('GET', urlKey, null, true, 200, 'OK', function (xhr) {

				equal(xhr.responseText, testText);
                var digestBytes = Crypto.SHA1(xhr.responseText, { asBytes: true });
                var digest = Crypto.util.bytesToHex(digestBytes);
                headers["If-Matches"] = '"'+digest+'"';

				env.util.requestWithHeaders('PUT', urlKey, headers, testText + '_modified', true, 204, 'No Content', function () {
					env.util.request('GET', urlKey, null, true, 200, 'OK', function (xhr) {
						equal(xhr.responseText, testText + '_modified');
						env.util.request('DELETE', urlKey, null, true, 204, 'No Content', function () {
							env.util.request('GET', urlKey, null, true, 404, 'Not Found', function () {
								start();
							});
						});
					});
				});
			});
		});
	});
};

Util.prototype.concurrencyRulesTest = function(env, url, failOnIgnore) {
    "use strict";
	var testText = 'profile / state concurrency test : ' + env.id;
    var digest = null;

    async.waterfall([
	    function(cb){ 
            //Normal get, shouldn't exist
            env.util.request('GET', url, null, true, 404, 'Not Found', function(){cb()}); 
        },
        function(cb){ 
            //Normal put, nothing exists, no concurrency headers needed
            env.util.request('PUT', url, testText, true, 204, 'No Content', function(){cb()}); 
        },
		function(cb){ 
            //Make sure it's there, and determine correct etag (SHA1 hash of content)
            env.util.request('GET', url, null, true, 200, 'OK', 
                function(xhr){
                    equal(xhr.responseText, testText);
                    var digestBytes = Crypto.SHA1(xhr.responseText, { asBytes: true });
                    digest = Crypto.util.bytesToHex(digestBytes);
                    cb();
                });
        },
		function(cb){
            //Try to put assuming nothing is there, should fail
            var headers = {"If-None-Matches":"*"};
			env.util.requestWithHeaders('PUT', url, headers, testText + '_modified', true, 
                                        412, 'Precondition Failed', function(){cb()});
        },
        function(cb){
            //Try to put using a bad etag, should also fail
            var headers = {"If-Matches":'"XYZ"'};
    	    env.util.requestWithHeaders('PUT', url, headers, testText + '_modified', true, 
                                        412, 'Precondition Failed', function(){cb()});
        },
        function(cb){
            //Put with bad headers, but same content. Same content means all is well regardless.
            var headers = {"If-Matches":'"XYZ"'};
    	    env.util.requestWithHeaders('PUT', url, headers, testText, true, 
                                        204, 'No Content', function(){cb()});
        },
        function(cb){
            //Try to put with a good etag, should succeed
            var headers = {"If-Matches":'"'+digest+'"'};
    	    env.util.requestWithHeaders('PUT', url, headers, testText + '_modified', true, 
                                        204, 'No Content', function(){cb()});
        },
        function(cb){
            if(failOnIgnore === false){
                //Put with no headers, different content. For state API only, this is accepted.
    	        env.util.request('PUT', url, testText + '_modified_2', true, 204, 'No Content', function(){cb()});
            } else {
                //Put with no headers, different content. For profile APIs, should be conflict.
    	        env.util.request('PUT', url, testText + '_modified_2', true, 409, 'Conflict', function(){cb()});
            }
        },
        function(cb){ 
            start(); 
        },
	]);
};

Util.prototype.tryJSONParse = function (text) {
	"use strict";
	try {
		return JSON.parse(text);
	} catch (ex) {
		ok(false, ex.message + ' : ' + text);
		return {};
	}
};

String.prototype.addFS = function () {
	"use strict";
	if (this.charAt(this.length - 1) !== '/') {
		return this.toString() + '/';
	} else {
		return this;
	}
};

Util.prototype.clone = function (a) {
	"use strict";
	return JSON.parse(JSON.stringify(a));
};

Util.prototype.testListInList = function(test, list, message) {
	"use strict";

	var missing = false,
		ii;
	
	if (test instanceof Array) {
		for (ii = 0; ii < test.length; ii++) {
			if (!this.inList(test[ii], list)) {
				missing = true;
				break;
			}
		}
	} else {
		missing = !this.inList(test, list);
	}
	
	if (missing) {
		deepEqual(list, test, message);
	} else {
		ok(true, message);
	}
};

/*!
Modified from: Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
Util.prototype.ruuid = function () {
	"use strict";
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

Util.prototype.ISODateString = function(d){
 function pad(val, n){
    if(val == null){
        val = 0;
    }
    if(n == null){
        n = 2;
    }
    var padder = Math.pow(10, n-1);
    var tempVal = val.toString();
    while(val < padder && padder > 1){        
        tempVal = '0' + tempVal;
        padder = padder / 10;
    }
    return tempVal;
 }

 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'.'
      + pad(d.getUTCMilliseconds(), 3)+'Z';
};


Util.prototype.DateFromISOString = function(string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    var time = (Number(date) + (offset * 60 * 1000));

    var dateToReturn = new Date();
    dateToReturn.setTime(Number(time));
    return dateToReturn;
};

Util.prototype.log = function(str){
    if(console !== undefined){
        console.log(str);
    }
};

Util.prototype.buildQueryString = function (filters) {
	"use strict";
	var prop, queryString = [];
	
	for (prop in filters) {
		if (filters.hasOwnProperty(prop)) {
			queryString.push(prop + '=' + encodeURIComponent(filters[prop]));
		}
	}
	
	return queryString.join('&');
};

Util.prototype.parseQueryString = function(qs, parsed) {
	var loc, pairs, pair, ii;
	
	if (!parsed) {
		parsed = {};
	}
	
	
	if (qs) {
		pairs = qs.split('&');
		for ( ii = 0; ii < pairs.length; ii++) {
			pair = pairs[ii].split('=');
			if (pair.length === 2 && pair[0]) {
				parsed[pair[0]] = decodeURIComponent(pair[1]);
			}
		}
	}
	
	return parsed;
};
