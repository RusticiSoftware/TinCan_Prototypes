
var TINCAN = (TINCAN || {});

TINCAN.Viewer = function(){ 
	this.firstStored = null;
	this.moreStatementsUrl = null;
	this.auth = null;
	this.endpoint = null;
	this.includeRawData = true;
};

TINCAN.Viewer.prototype.getCallback = function(callback){
	var self = this;
	return function(){ callback.apply(self, arguments); };
};

TINCAN.Viewer.prototype.getAuth = function(){ 
	if(this.auth == null){
		this.auth = 'Basic ' + Base64.encode(Config.authUser + ':' + Config.authPassword);
	}
	return this.auth;
};

TINCAN.Viewer.prototype.getEndpoint = function(){
	if(this.endpoint == null){
		this.endpoint = Config.endpoint;
	}
	return this.endpoint;
};


TINCAN.Viewer.prototype.TinCanStatementQueryObject = function(){
	this.verb = null;
	this.object = null;
	this.registration = null;
	this.context = false;
	this.actor = null;
	this.since = null;
	this.until = null;
	this.limit = 0;
	this.authoritative = true;
	this.sparse = false;
	this.instructor = null;
	
	this.toString = function(){
		var qs = new Array();
		for(var key in this){
			if(key == "toString" || this[key] == null){
				continue;
			}
			var val = this[key];
			if(typeof val == "object"){
				val = JSON.stringify(val);
			}
			qs.push(key + "=" + encodeURIComponent(val));
		}
		return qs.join("&");
	};
};

TINCAN.Viewer.prototype.TinCanSearchHelper = function(){
	this.getActor = function(){
		var actor = null;
		var actorJson = this.getSearchVar("actorJson");
		var actorEmail = this.getSearchVar("actorEmail");
		var actorAccount = this.getSearchVar("actorAccount");
		
		if(actorJson != null && actorJson.length > 0){
			actor = JSON.parse(actorJson);
		} 
		else {
			if(actorEmail != null){
				actor = (actor == null) ? new Object() : actor;
				if(actorEmail.indexOf('mailto:') == -1){
					actorEmail = 'mailto:'+actorEmail;
				}
				actor["mbox"] = [actorEmail];
			}
			
			if(actorAccount != null){
				actor = (actor == null) ? new Object() : actor;
				var accountParts = actorAccount.split("::");
				actor["account"] = [{"accountServiceHomePage":accountParts[0], "accountName":accountParts[1]}];
			}
		}
		return actor;
	};
	
	this.getVerb = function(){
		return this.getSearchVar("verb");
	};
	
	this.getObject = function(){
		var obj = null;
		var objectJson = this.getSearchVar("objectJson");
		if(objectJson != null){
			obj = JSON.parse(objectJson);
		} else {
			var activityId = this.getSearchVar("activityId");
			if(activityId != null){
				obj = {"id":activityId};
			}
		}
		return obj;
	};
	
	this.getRegistration = function(){
		return this.getSearchVar("registration");
	};
	
	this.getContext = function(){
		return this.getSearchVarAsBoolean("context", "false");
	};
	
	this.getSince = function(){
		var since = this.getSearchVar("since");
		if(since != null && !this.dateStrIncludesTimeZone(since)){
			since = since + "Z";
		}
		return since;
	};
	
	this.getUntil = function(){
		var until = this.getSearchVar("until");
		if(until != null && !this.dateStrIncludesTimeZone(until)){
			until = until + "Z";
		}
		return until;
	};
	
	this.getAuthoritative = function(){
		return this.getSearchVarAsBoolean("authoritative", "true");
	};
	
	this.getSparse = function(){
		return this.getSearchVarAsBoolean("sparse", "false");
	};
	
	this.getInstructor = function(){
		var instructorJson = this.getSearchVar("instructorJson");
		if(instructorJson != null){
			return JSON.parse(instructorJson);
		};
		return null;
	};
	
	this.dateStrIncludesTimeZone = function(str){
		return str != null && (str.indexOf("+") >= 0 || str.indexOf("Z") >= 0); 
	};
	
	this.nonEmptyStringOrNull = function(str){
		return (str != null && str.length > 0) ? str : null;
	};
	
	this.getSearchVar = function(searchVarName, defaultVal){
		var myVar = $("#"+searchVarName).val();
		if(myVar == null || myVar.length < 1){
			return defaultVal;
		}
		return myVar;
	};
	
	this.getSearchVarAsBoolean = function(searchVarName, defaultVal){
		return $("#"+searchVarName).is(":checked");
	};
};

TINCAN.Viewer.prototype.TinCanFormHelper = function(){
	this.copyQueryStringToForm = function(){
		var booleanVals = ["context", "authoritative", "sparse"];
		var qsMap = this.getQueryStringMap();
		for(var key in qsMap){
			var inputType = ($.inArray(key, booleanVals) >= 0) ? "checkbox" : "text";
			this.setInputFromQueryString(key, qsMap[key], inputType);
		}
	};
	
	this.setInputFromQueryString = function(name, val, inputType){
		if(inputType == null){
			inputType = "text";
		}
		if(val != null){
			if(inputType == "text"){
				$("#"+name).val(val);
			}
			else if (inputType == "checkbox"){
				if(val == "true"){
					$("#"+name).attr('checked', 'checked');
				} else {
					$("#"+name).removeAttr('checked');
				}
			}
		};
	};
	
	this.getQueryStringMap = function(){
		var qs = window.location.search;
		if(qs == null || qs.length < 1){
			return [];
		}
		if(qs.indexOf("#") > 0){
			qs = qs.substring(0, qs.indexOf("#"));
		}
		qs = qs.substring(1, qs.length);
		var nameVals = qs.split("&");
		var qsMap = {};
		for(var i = 0; i < nameVals.length; i++){
			var keyVal = nameVals[i].split("=");
			qsMap[keyVal[0]] = decodeURIComponent(keyVal[1].replace(/\+/g, " "));
		}
		return qsMap;
	};
};

TINCAN.Viewer.prototype.searchStatements = function(){
	var helper = new this.TinCanSearchHelper(); 
	var queryObj = new this.TinCanStatementQueryObject();

	queryObj.actor = helper.getActor();
	queryObj.verb = helper.getVerb();
	queryObj.object = helper.getObject();
	queryObj.registration = helper.getRegistration();
	queryObj.context = helper.getContext();
	queryObj.since = helper.getSince();
	queryObj.until = helper.getUntil();
	queryObj.authoritative = helper.getAuthoritative();
	queryObj.sparse = helper.getSparse();
	queryObj.instructor = helper.getInstructor();
	queryObj.limit = 25;
	
	var url = this.getEndpoint() + "statements?" + queryObj.toString();
	$("#TCAPIQueryText").text(url);

	this.getStatements(queryObj, this.getCallback(this.renderStatementsHandler));
};

TINCAN.Viewer.prototype.getMoreStatements = function(){
	if (this.moreStatementsUrl !== null){
		$("#statementsLoading").show();
		var url = this.getEndpoint() + this.moreStatementsUrl.substr(1);
		XHR_request(url, "GET", null, this.getAuth(), this.getCallback(this.renderStatementsHandler));
	}
};

TINCAN.Viewer.prototype.getStatements = function(queryObj, callback){
	var url = this.getEndpoint() + "statements?" + queryObj.toString();
	XHR_request(url, "GET", null, this.getAuth(), callback);
};

TINCAN.Viewer.prototype.getActivityProfile = function(activityId, profileKey, callbackFunction) {
		var url = this.getEndpoint() + "activities/profile?activityId=<activity ID>&profileId=<profilekey>";
		url = url.replace('<activity ID>',encodeURIComponent(activityId));
		url = url.replace('<profilekey>',encodeURIComponent(profileKey));
		XHR_request(url, "GET", null, this.getAuth(), callbackFunction, true);
};

TINCAN.Viewer.prototype.renderStatementsHandler = function(xhr){
	this.renderStatements(JSON.parse(xhr.responseText));
};

TINCAN.Viewer.prototype.renderStatements = function(statementsResult){
	function getActorName(actor){
		if(actor === undefined){
			return "";
		}
		if(actor.name !== undefined){
			return actor.name[0];
		}
		if(actor.mbox !== undefined){
			return actor.mbox[0];
		}
		if(actor.account !== undefined){
			return actor.account[0].accountName;
		}
		return truncateString(JSON.stringify(actor), 20);
	}
	
	function getTargetDesc(obj){
		if(obj.objectType !== undefined && obj.objectType !== "Activity"){
			return getActorName(obj);
		}
		
		if(obj.definition !== undefined){
			if(obj.definition.name !== undefined){
				if(obj.definition.name["und"] !== undefined){
					return obj.definition.name["und"];
				}
				return obj.definition.name["en-US"];
			}
			
			if(obj.definition.description !== undefined){
				if(obj.definition.description["und"] !== undefined){
					return truncateString(obj.definition.description["und"], 48);
				}
				return truncateString(obj.definition.description["en-US"], 48);
			}
		}
		return obj.id;
	}
	
	function truncateString(str, length){
		if(str == null || str.length < 4 || str.length <= length){
			return str;
		}
		return str.substr(0, length-3)+'...';
	};
	
	
    var statements = statementsResult.statements;
    
    this.moreStatementsUrl = statementsResult.more;
    if(this.moreStatementsUrl === undefined || this.moreStatementsUrl === null){
    	$("#showAllStatements").hide();
    } else {
    	$("#showAllStatements").show();
    }
	
    var stmtStr = new Array();
	stmtStr.push("<table>");
	
	var i;
	var dt;
	var aDate;

	if (statements.length > 0) {
		if (!this.firstStored) {
			this.firstStored = statements[0].stored;
		}
	}
	
	if(statements.length == 0){
		$("#statementsLoading").hide();
		$("#noStatementsMessage").show();
	}

	for (i = 0; i < statements.length ; i++){
		var stmt = statements[i];
		try {
			stmtStr.push("<tr class='statementRow'>");  
			//dt = TCDriver_DateFromISOString(statements[i].stored);
			//stmtStr.push("<td class='date'>"+ dt.toLocaleDateString() + " " + dt.toLocaleTimeString()  +"</td>");
			stmtStr.push("<td class='date'><div class='statementDate'>"+ stmt.stored.replace('Z','')  +"</div></td>");

			stmtStr.push("<td >");
				stmtStr.push("<div class=\"statement unwired\" tcid='" + stmt.id + "'>")
					stmtStr.push("<span class='actor'>"+ getActorName(stmt.actor) +"</span>");
			
					var verb = stmt.verb;
					var objDesc = getTargetDesc(stmt.object);
					var answer = null;
					
					if (stmt.object.definition !== undefined){
			            var activityType = stmt.object.definition.type;
						if (activityType != undefined && (activityType == "question" || activityType == "interaction")){
							if (stmt.result != undefined){
								if (stmt.result.success != undefined){
									verb = ((stmt.result.success)?"correctly ":"incorrectly ") + verb;
								}
								if (stmt.result.response != undefined){
									answer = " with response '" + truncateString(stmt.result.response, 12) + "'.";
								}
							}
							
						}
					}		
					
					stmtStr.push(" <span class='verb'>"+ verb +"</span>");
					stmtStr.push(" <span class='object'>'"+ getTargetDesc(stmt.object) +"'</span>");
					stmtStr.push((answer != "")? answer : ".");
					
					if (stmt.result != undefined){
						if (stmt.result.score != undefined && stmt.result.score.raw != undefined){
							stmtStr.push(" with score <span class='score'>"+ stmt.result.score.raw +"</span>");
						}
					}
					
				stmtStr.push("</div>");
				
				if(this.includeRawData){
					stmtStr.push("<div class='tc_rawdata' tcid_data='" + stmt.id + "'>");
						stmtStr.push("<pre>" + JSON.stringify(stmt, null, 4) + "</pre>")
					stmtStr.push("</div>");
				}
			
			stmtStr.push("</td></tr>");
		}
		catch (error){
			TCDriver_Log("Error occurred while trying to display statement with id " + stmt.id + ": " + error.message);
		}
	}
	stmtStr.push("</table>");
	
	$("#statementsLoading").hide();
	
	$("#theStatements").append(stmtStr.join(''));
	var unwiredDivs = $('div[tcid].unwired');
	unwiredDivs.click(function(){
		$('[tcid_data="' + $(this).attr('tcid') + '"]').toggle();
	});
	unwiredDivs.removeClass('unwired');
};


TINCAN.Viewer.prototype.pageInitialize = function(){
	var tcViewer = this;
	
	$.datepicker.setDefaults( {dateFormat: "yy-mm-dd", constrainInput: false} );
	$( "#since" ).datepicker();
	$( "#until" ).datepicker()
	
	$("#statementsLoading").show();
	$("#showAllStatements").hide();
	$("#noStatementsMessage").hide();
	
	$('#refreshStatements').click(function(){
		$("#statementsLoading").show();
		$("#showAllStatements").hide();
		$("#noStatementsMessage").hide();
		$("#theStatements").empty();
		tcViewer.searchStatements();
	});
	$('#showAllStatements').click(function(){
		$("#statementsLoading").show();
		tcViewer.getMoreStatements();
	});
	
	$("#showAdvancedOptions").click(function(){
		$("#advancedSearchTable").toggle('slow', function(){
			var visible = $("#advancedSearchTable").is(":visible");
			var text = (visible ? "Hide" : "Show") + " Advanced Options";
			$("#showAdvancedOptions").html(text);
		});
	});
	
	$("#showQuery").click(function(){
		$("#TCAPIQuery").toggle('slow', function(){
			var visible = $("#TCAPIQuery").is(":visible");
			var text = (visible ? "Hide" : "Show") + " TCAPI Query";
			$("#showQuery").html(text);
		});
	});
	
	(new this.TinCanFormHelper()).copyQueryStringToForm();
};



