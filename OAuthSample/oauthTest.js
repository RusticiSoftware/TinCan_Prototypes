(function(global){

    var OAuthSample = function(){
        this.auth = null;
        this.tinCanVersion = "1.0.0";
        this.DEBUG = false;
        //test statement used to test POST operations.
        this.testStatementObj = {
          "actor": {
            "name": "Test Actor",
            "mbox": "mailto:test.actor@example.org",
            "objectType": "Agent" 
          },
          "verb": {
            "id": "http://adlnet.gov/expapi/verbs/passed",
            "display": { 
              "en-US": "passed"
            }
          },
          "object": {
            "id": "https://example.org/test2/zaken…",
            "definition": { 
              "name": {
                "en-US": "Maintenancee test"
              },
              "type": "http://adlnet.gov/expapi/activities/assessment"
            },
            "objectType": "Activity"
          }
        };
        this.testStatment = JSON.stringify(this.testStatementObj);
    }
    
    OAuthSample.prototype = {

        init: function() {
            var self = this,
                parsedQueryString = {};

            function register(name, fn) {
                window.document.getElementById(name).onclick = fn;
            }

            register("authorize", function(){ self.authorize(); });
            register("fetchToken", function(){ self.fetchToken(); });
            register("tryToken", function(){ self.tryToken(); });
            register("tryTokenPost", function(){ self.tryTokenPost(); });
            register("tryNoUserToken", function(){ self.tryNoUserToken(); });
            register("tryNoUserTokenPost", function(){ self.tryNoUserTokenPost(); });

            this._userLog("OAuth sample initialized");

            //Try to discover endpoint from query string...
            if (window.location.search.length > 0) {
                this._parseQueryString(window.location.search.substring(1), parsedQueryString);
                if (parsedQueryString["endpoint"] !== undefined) {
                    window.document.getElementById("endpoint").value = parsedQueryString["endpoint"];
                    this._userLog("Discovered endpoint from query string");
                }
            }
        },

        log: function(msg) {
            if (this.DEBUG === true) {
                console.log(msg);
            }
        },

        
        authorize: function () {
            var message, accessor, parameterMap, xhr, oauthCallback, 
                self = this,
                endpoint = this._getFormVal("endpoint"),
                consumerKey = this._getFormVal("consumerKey"),
                consumerSecret = this._getFormVal("consumerSecret");
            
            if (endpoint == "" || consumerKey == "" || consumerSecret == "") {
                self._error("Please fill in the endpoint, consumer key, and consumer secret");
                return;
            }

            this.auth = {
               type: "oAuth", 
               consumerKey : consumerKey,
               consumerSecret : consumerSecret
            };
        
            this._request("POST", endpoint + "OAuth/initiate?oauth_callback=oob", null, null, this.auth, function(xhr) {

                if (xhr.status === 200) {
                    self._parseQueryString(xhr.responseText, self.auth);
                } else {
                    self._error("(Initiate) Error: " + xhr.status + " ; " + xhr.responseText);
                    return;
                }
                
                self.log(JSON.stringify(self.auth, null, 4));

                self._userLog("Obtained request token, sending to authorize page...");
                self._userLog("Please fill in verify code from authorize " +
                              "process, and proceed to step 2");
                
                self._showAuthorizePage(
                    endpoint + "OAuth/authorize?oauth_token=" + self.auth.oauth_token);
            });
        },
        
        fetchToken: function () {
            var message, accessor, parameterMap, xhr, 
                self = this,
                endpoint = this._getFormVal("endpoint");
        
            if (this.auth.oauth_verifier == undefined) {
                this.auth.oauth_verifier = this._getFormVal("verifyCode");
                if (this.auth.oauth_verifier === null || this.auth.oauth_verifier == "") {
                    this._error("Please authorize and fill in verify code first");
                    return;
                }
            }
            
            this._request("POST", endpoint + "OAuth/token", null, null, this.auth, function(xhr) {
                if (xhr.status === 200) {
                    self._parseQueryString(xhr.responseText, self.auth);
                } else {
                    self._error("Error: " + xhr.status + " ; " + xhr.responseText);
                    return;
                }
                
                self.log(JSON.stringify(self.auth, null, 4));
                self._userLog("Exchanged request token for access token! Now try it in step 3...");
            });
        },

        tryToken: function() {
            var self = this,
                endpoint = self._getFormVal("endpoint");

            if (this.auth.oauth_verifier == undefined) {
                this._error("Please authorize and fill in verify code first");
                return;
            }

            this._request("GET", endpoint + "statements?limit=1", null, null, this.auth, function(xhr) {
                if (xhr.status === 200) {
                    self._userLog("Successfully issued GET request on /statements resource with OAuth credentials!");
                } else {
                    self._error("OAuth signed statements request failed");
                }
            });
        },
        tryTokenPost: function() {
          var self = this,
            endpoint = self._getFormVal("endpoint");

          if (this.auth.oauth_verifier == undefined) {
            this._error("Please authorize and fill in verify code first");
            return;
          }

          this._request("POST", endpoint + "statements", null, this.testStatement, this.auth, function(xhr) {
            if (xhr.status === 200) {
              self._userLog("Successfully issued POST request on /statements resource with OAuth credentials!");
            } else {
              self._error("OAuth signed statements request failed: " + xhr.status + " ; " + xhr.responseText);
            }
          })
        },

        tryNoUserToken: function() {
            var noUserAuth,
                self = this,
                endpoint = this._getFormVal("endpoint"),
                consumerKey = this._getFormVal("consumerKey"),
                consumerSecret = this._getFormVal("consumerSecret");
            
            if (endpoint == "" || consumerKey == "" || consumerSecret == "") {
                self._error("Please fill in the endpoint, consumer key, and consumer secret");
                return;
            }

            noUserAuth = {
               type : "oAuth", 
               consumerKey : consumerKey,
               consumerSecret : consumerSecret,
               oauth_token : "",
               oauth_token_secret : ""
            };

            this._request("GET", endpoint + "statements?limit=1", null, null, noUserAuth, function(xhr) {
                if (xhr.status === 200) {
                    self._userLog("Successfully issued GET request on " +
                        "/statements resource with (no user) OAuth credentials!");
                } else {
                    self._error("OAuth signed statements request failed");
                }
            });
        },
        tryNoUserTokenPost: function() {
          var noUserAuth,
            self = this,
            endpoint = this._getFormVal("endpoint"),
            consumerKey = this._getFormVal("consumerKey"),
            consumerSecret = this._getFormVal("consumerSecret");

          if (endpoint == "" || consumerKey == "" || consumerSecret == "") {
            self._error("Please fill in the endpoint, consumer key, and consumer secret");
            return;
          }

          noUserAuth = {
            type : "oAuth", 
            consumerKey : consumerKey,
            consumerSecret : consumerSecret,
            oauth_token : "",
            oauth_token_secret : ""
          };

          this._request("POST", endpoint + "statements", null, this.testStatement, noUserAuth, function(xhr) {
            if (xhr.status === 200) {
              self._userLog("Successfully issued POST request on " +
                "/statements resource with (no user) OAuth credentials!");
            } else {
              self._error("OAuth statements resource with (no user) request failed: " + xhr.status + " ; " + xhr.responseText);
            }
          });
        },

        _getFormVal: function(name) {
            return window.document.getElementById(name).value;
        },

        _showAuthorizePage: function(authPage) {
            window.open(authPage);
        },

        _error: function(msg) {
            alert(msg);
        },

        _userLog: function(msg) {
            window.document.getElementById("userLog").innerHTML += ("<li>"+msg+"</li>");
        },
        
        _oAuthSign: function (url, method, data, auth) {
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
                if (p.substring(0, 6) == "oauth_" || p == "consumer_name") {
                    encodedParameter = p + "=" + encodeURIComponent(parameterMap[p]);
                    // only add parameters that are not already on the query string or in the form post
                    if (url.indexOf(encodedParameter) == -1 && (data == null || data.indexOf(encodedParameter) == -1)) {
                        url += (url.indexOf("?") > -1 ? "&" : "?") + encodedParameter;
                    }
                }
            }
            this.log("url: " + url);
            return url;
        },
        
        _request: function (method, url, headers, data, auth, callback) {
            var xhr = new XMLHttpRequest(), 
                headerName;

            xhr.open(method, this._oAuthSign(url, method, data, auth), true);
        
            //Set headers
            if(headers !== null){
                for(var headerName in headers){
                    xhr.setRequestHeader(headerName, headers[headerName]);
                }
            }

            //Set TCAPI version header
            xhr.setRequestHeader("X-Experience-API-Version", this.tinCanVersion);
            xhr.setRequestHeader("Content-Type", "application/json");
            //Setup callback
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(xhr);
                }
            };
        
            //Contact
            try {
                xhr.send(data);
            } catch (ex) {
                ok(false, ex.toString());
                console.error(ex.toString());
            }
        },
        
        _parseQueryString: function (qs, parsed) {
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
        }
    }

    global.OAuthSample = OAuthSample;

})(this);
