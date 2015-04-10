/*

   Copyright 2012 Rustici Software, LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
//TinCan.enableDebug();

var firstStored = null,
    moreStatementsUrl = null,
    tincan = new TinCan (
        {
            url: window.location.href,
            recordStores: [
                {
                    endpoint: Config.endpoint,
                    auth: 'Basic ' + Base64.encode(Config.authUser + ':' + Config.authPassword),
                    version: "1.0.0"
                }
            ]
        }
    );

google.load('visualization', '1.0', { packages: ['corechart'] });

$(document).ready(function(){
    var getTetrisStatements = {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed"
            }
        },
        tetrisActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/tetris"
            }
        ),
        getGolfStatements = {},
        golfActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/golf-example"
            }
        ),
        getTourStatements = {},
        tourActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour"
            }
        );

    if (tincan.recordStores[0].version === "0.9" || tincan.recordStores[0].version === "0.95") {
        getTetrisStatements.target = tetrisActivity;
        getGolfStatements.target = golfActivity;
        getTourStatements.target = tourActivity;
    }
    else {
        getTetrisStatements.activity = tetrisActivity;
        getTetrisStatements.related_activities = true;
        getGolfStatements.activity = golfActivity;
        getGolfStatements.related_activities = true;
        getTourStatements.activity = tourActivity;
        getTourStatements.related_activities = true;
    }

    tincan.getStatements(
        {
            params: {
                limit: 25
            },
            callback: RenderStatements
        }
    );

    $('#refreshStatements').click(function(){
        $("#theStatements").empty();

        tincan.getStatements(
            {
                params: {
                    limit: 25
                },
                callback: RenderStatements
            }
        );
    });
    $('#showAllStatements').click(function(){
        if (moreStatementsUrl !== null) {
            tincan.recordStores[0].moreStatements(
                {
                    url: moreStatementsUrl,
                    callback: RenderStatements
                }
            );
        }
        else {
            tincan.getStatements(
                {
                    params: {
                        limit: 25
                    },
                    callback: RenderStatements
                }
            );
        }
    });

    tincan.getActivityProfile(
        "highscores",
        {
            activity: tetrisActivity,
            callback: RenderHighScores
        }
    );
    tincan.getStatements(
        {
            params: getTetrisStatements,
            callback: RenderTetrisScoreChart
        }
    );
    $("#refreshHighScores").click(function(){
        $("#tetrisHighScoreData").empty();

        tincan.getActivityProfile(
            "highscores",
            {
                activity: {
                    id: "http://id.tincanapi.com/activity/tincan-prototypes/tetris"
                },
                callback: RenderHighScores
            }
        );

        tincan.getStatements(
            {
                params: getTetrisStatements,
                callback: RenderTetrisScoreChart
            }
        );
    });

    tincan.getStatements(
        {
            params: getGolfStatements,
            callback: RenderGolfData
        }
    );
    RequestGolfQuestions();

    $("#refreshGolfData").click(function(){
        $("#golfCourseData").empty();

        tincan.getStatements(
            {
                params: getGolfStatements,
                callback: RenderGolfData
            }
        );

        $(".golfQuestion").remove();
        RequestGolfQuestions();
    });

    tincan.getStatements(
        {
            params: getTourStatements,
            callback: RenderLocationData
        }
    );
    RequestLocations();

    $('#refreshLocationCourseData').click(function(){
        $("#locationCourseData").empty();

        tincan.getStatements(
            {
                params: getTourStatements,
                callback: RenderLocationData
            }
        );

        $(".locationRow").remove();
        RequestLocations();
    });
});

function RenderStatements (err, result) {
    var statementsResult,
        statements,
        stmtStr = "<table>",
        i,
        dt,
        aDate,
        name,
        obj,
        activityType,
        answer,
        corrAnswer;

    if (err !== null) {
        return;
    }

    statementsResult = result;
    statements = statementsResult.statements,
    moreStatementsUrl = statementsResult.more;

    if (moreStatementsUrl === null) {
        $("#showAllStatements").hide();
    }

    if (statements.length > 0) {
        if (!firstStored) {
            firstStored = statements[0].stored;
        }
    }

    for (i = 0; i < statements.length ; i++) {
        aDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(statements[i].stored);
        dt = new Date(Date.UTC(aDate[1], aDate[2]-1, aDate[3], aDate[4], aDate[5], aDate[6]));
        name = statements[i].actor.toString();

        stmtStr += "<tr class='statement' tcid='" + statements[i].id + "'>";
        stmtStr += "<td class='date'>"+ dt.toLocaleDateString() + " " + dt.toLocaleTimeString()  +"</td>";
        stmtStr += "<td> <span class='actor'>"+ name +"</span>";

        obj = statements[i].target.id;
        if (statements[i].target.objectType === "Activity" && statements[i].target.definition !== null) {
            activityType = statements[i].target.definition.type;

            if (activityType !== null && (activityType.indexOf("question") >= 0 || activityType.indexOf("interaction") >= 0)) {
                obj = (statements[i].target.definition.description !== null) ? statements[i].target.definition.getLangDictionaryValue("description") : obj;

                answer = "";
                corrAnswer = "";
                if (statements[i].result !== null) {
                    if (statements[i].result.success !== null) {
                        stmtStr += " <span class='score'>" + (statements[i].result.success ? "correctly" : "incorrectly") + "</span>";
                        if (!statements[i].result.success && statements[i].target.definition.correctResponsesPattern !== null) {
                            corrAnswer = " The correct response is '" + statements[i].target.definition.correctResponsesPattern[0] + "'.";
                        }
                    }
                    if (statements[i].result.response !== null) {
                        answer = " with response '" + statements[i].result.response + "'.";
                    }
                }
                stmtStr += " <span class='verb'>" + statements[i].verb.toString() + "</span>";
                stmtStr += " <span class='object'>'" + obj + "'</span>";
                stmtStr += (answer != "") ? answer : ".";
                stmtStr += corrAnswer;
            } else if (statements[i].verb.id === "http://adlnet.gov/expapi/verbs/experienced" && statements[i].target.definition.type !== null && statements[i].target.definition.type === "Location") {
                obj = (statements[i].target.definition.name != undefined) ? statements[i].target.definition.name["en-US"] : obj;
                stmtStr += " <span class='verb'>" + statements[i].verb.toString() + "</span>";
                stmtStr += " <span class='object'>"+ obj +"</span>";
            } else {
                if (statements[i].context !== null && statements[i].context.extensions !== null && typeof statements[i].context.extensions.latitude !== "undefined" && typeof statements[i].context.extensions.longitude !== "undefined") {
                    stmtStr += " <span class='verb'>visited</span>";
                    obj = statements[i].target.definition.getLangDictionaryValue("description");
                    stmtStr += " (latitude: " + statements[i].context.extensions.latitude + ", longitude: " + statements[i].context.extensions.longitude + ")";
                } else {
                    stmtStr += " <span class='verb'>" + statements[i].verb.toString() + "</span>";
                    obj = (statements[i].target.definition.name !== null) ? statements[i].target.definition.getLangDictionaryValue("name") : obj;
                }
                stmtStr += " <span class='object'>" + obj +" </span>";
            }
        }
        else {
            stmtStr += " <span class='verb'>" + statements[i].verb.toString() + "</span>";
            stmtStr += " <span class='object'>" + statements[i].target.toString() + "</span>";
        }

        if (statements[i].result !== null) {
            if (statements[i].result.score !== null && statements[i].result.score.raw !== null) {
                stmtStr += " with score <span class='score'>" + statements[i].result.score.raw + "</span>";
            }
        }
        stmtStr += "<div class='tc_rawdata' tcid_data='" + statements[i].id + "'><pre>" + statements[i].originalJSON + "</pre></div>";
        stmtStr += "</td></tr>";
    }
    stmtStr += "</table>";

    $("#theStatements").append(stmtStr);
    $('tr[tcid]').click(function(){
        $('[tcid_data="' + $(this).attr('tcid') + '"]').toggle();
    })
}

function RenderHighScores (err, result) {
    var scores,
        html,
        i,
        name = "",
        dt;

    if (err !== null) {
        html = "Error occurred: " + err;
        return;
    }

    if (result !== null && result.contents !== null && result.contents !== "") {
        scores = JSON.parse(result.contents);
        if (scores.length > 0){
            $("#tetrisHighScoreData").empty();
        }

        html = "<table>";
        for (i = 0; i < scores.length; i++) {
            dt = scores[i].date.substr(0, 19).replace("T", " "); //yyyy-MM-ddTHH:mm:ss
            if (typeof scores[i].actor !== "undefined") {
                name = (typeof scores[i].actor.name !== "undefined") ? scores[i].actor.name : scores[i].actor.mbox;
            }

            html += "<tr class='highScoreRow'>";
            html += "<td class='scoreRank'>" + (i + 1) + "</td>";
            html += "<td class='actor'>" + name + "</td>";
            html += "<td class='score'>" + scores[i].score + "</td>";
            html += "<td class='date'>" + dt + "</td>";
            html += "</tr>";
        }
        html += "</table>";
    }
    else {
        html = "No scores recorded.";
    }

    $("#tetrisHighScoreData").append(html);
}

function RenderTetrisScoreChart (err, result) {
    var statements,
        playerScores = {},
        players = [],
        scores = [],
        maxScore = 0,
        i,
        name,
        score,
        height,
        data,
        options,
        chart,
        gamesData,
        gamesOptions,
        gamesChart;

    if (err !== null) {
        $('#tetrisScoresChart').append("Error occurred: " + err);
        return;
    }

    statements = result.statements;
    for (i = 0; i < statements.length ; i++){
        name = statements[i].actor.toString();

        score = (
            statements[i].result !== null
            && statements[i].result.score !== null
            && statements[i].result.score.raw !== null
        ) ? statements[i].result.score.raw : 0;

        if (typeof playerScores[name] !== "undefined") {
            if (score > playerScores[name].score) {
                playerScores[name].score = score;
                playerScores[name].count++;
                scores[playerScores[name].index] = score;
            }
        } else {
            playerScores[name] = {};
            playerScores[name].score = score;
            playerScores[name].index = scores.push(score)-1;
            playerScores[name].count = 1;
            players.push(name);
        }
    }

    height = (players.length * 40) + 50;

    data = new google.visualization.DataTable();
    data.addColumn('string', 'Player');
    data.addColumn('number', 'Score');
    data.addRows(players.length);
    for (i = 0; i < players.length;i++){
        data.setCell(i,0,players[i]);
        data.setCell(i,1,scores[i]);
    }

    // Set chart options
    options = {
        title: 'Tetris Personal Best Scores',
        width: 960,
        height: height,
        titleTextStyle: {fontSize: 14}
    };

    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.BarChart($('#tetrisScoresChart').get(0));
    chart.draw(data, options);

    gamesData = new google.visualization.DataTable();
    gamesData.addColumn('number', 'Games');
    gamesData.addColumn('number', 'Score');
    gamesData.addRows(players.length);
    for (i = 0; i < players.length; i++){
        gamesData.setCell(i, 0, playerScores[players[i]].count);
        gamesData.setCell(i, 1, playerScores[players[i]].score);
    }

    gamesOptions = {
        title: 'Tetris Games Played to achieve to High Score',
        width: 432,
        height: 300,
        hAxis: { title: 'Games' },
        vAxis: { title: 'Score' },
        legend: 'none',
        titleTextStyle: { fontSize: 14 }
    };

    // Instantiate and draw our chart, passing in some options.
    gamesChart = new google.visualization.ScatterChart($('#tetrisGamesScores').get(0));
    gamesChart.draw(gamesData, gamesOptions);
}

function RenderGolfData (err, result) {
    var statements,
        html,
        learners = [],
        learnerObjs = {},
        i,
        j,
        l,
        mbox,
        getStatementsParams = {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
            }
        },
        assessmentActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment"
            }
        );

    if (err !== null) {
        $('#golfCourseData').append("Error occurred: " + err);
        return;
    }

    statements = result.statements;

    html = "<table><tr class='labels'>";
    html += "<td class='name'>Learner</td>";
    html += "<td class='completion'>Status</td>";
    html += "<td class='score'>Score</td>";
    html += "</tr>";

    for (i = 0; i < statements.length; i++) {
        if (statements[i].actor === null) {
            continue;
        }
        mbox = statements[i].actor.mbox;
        if (typeof learnerObjs[mbox] === "undefined") {
            learners.push(mbox);
            learnerObjs[mbox] = {};
            learnerObjs[mbox].complete = 'incomplete';
            learnerObjs[mbox].score = '-';
        }
        if (typeof learnerObjs[mbox].name === "undefined" || learnerObjs[mbox].name == mbox) {
            learnerObjs[mbox].name = statements[i].actor.toString();
        }

        if (statements[i].verb.id === "http://adlnet.gov/expapi/verbs/completed") {
            learnerObjs[mbox].complete = 'complete';
        }
        if (statements[i].verb.id === "http://adlnet.gov/expapi/verbs/passed") {
            learnerObjs[mbox].complete = 'passed';
            learnerObjs[mbox].score = (statements[i].result.score.scaled * 100).toString() + "%";
        }
        if (statements[i].verb.id === "http://adlnet.gov/expapi/verbs/failed") {
            learnerObjs[mbox].complete = 'failed';
            learnerObjs[mbox].score = (statements[i].result.score.scaled * 100).toString() + "%";
        }
    }
    for (j in learners){
        l = learnerObjs[learners[j]];
        html += "<tr>";
        html += "<td class='name'>" + l.name + "</td>";
        html += "<td class='completion " + l.complete + "'>" + l.complete + "</td>";
        html += "<td class='score' mbox='" + learners[j] + "'>" + l.score + "</td>";
        html += "<tr>";
    }
    html += "</table>";

    $("#golfCourseData").append(html);

    if (tincan.recordStores[0].version === "0.9" || tincan.recordStores[0].version === "0.95") {
        getStatementsParams.target = assessmentActivity;
    }
    else {
        getStatementsParams.activity = assessmentActivity;
        getStatementsParams.related_activities = true;
    }

    tincan.getStatements(
        {
            params: getStatementsParams,
            callback: RenderGolfDataScores
        }
    );
}

function RenderGolfDataScores (err, result) {
    var statements,
        i,
        mbox;

    if (err !== null) {
        $('.score[mbox="' + mbox + '"]').text("Error occurred: " + err);
        return;
    }

    statements = result.statements;

    for (i = 0; i < statements.length ; i++) {
        mbox = statements[i].actor.mbox;
        $('.score[mbox="' + mbox + '"]').text(statements[i].result.score.raw);
    }
}

function RequestGolfQuestions () {
    var getStatementsParams = {
            verb: {
                id: "http://adlnet.gov/expapi/verbs/answered"
            }
        },
        assessmentActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/golf-example"
            }
        );


    if (tincan.recordStores[0].version === "0.9" || tincan.recordStores[0].version === "0.95") {
        getStatementsParams.target = assessmentActivity;
    }
    else {
        getStatementsParams.activity = assessmentActivity;
        getStatementsParams.related_activities = true;
    }

    tincan.getStatements(
        {
            params: getStatementsParams,
            callback: RenderGolfQuestions
        }
    );
}

function RenderGolfQuestions (err, result) {
    var statements,
        i,
        stmt,
        resultsByQuestion = {},
        questionId,
        sortedQuestionIds = [],
        html,
        results;

    if (err !== null || result.statements.length === 0) {
        return;
    }

    statements = result.statements;

    for (i = 0; i < statements.length; i++) {
        stmt = statements[i];

        questionId = stmt.target.id;

        if (typeof resultsByQuestion[questionId] === "undefined") {
            resultsByQuestion[questionId] = {
                question: stmt.target.definition.getLangDictionaryValue("description"),
                correctAnswer: "",
                numCorrect: 0,
                numIncorrect: 0
            };
            if (stmt.target.definition.correctResponsesPattern !== null) {
                if (stmt.target.definition.interactionType == "numeric"){
                    resultsByQuestion[questionId].correctAnswer = stmt.target.definition.correctResponsesPattern[0].split("[:]")[0];
                } 
                else {
                    resultsByQuestion[questionId].correctAnswer = stmt.target.definition.correctResponsesPattern[0];
                }
            }
        }
        if (stmt.result.success === true) {
            resultsByQuestion[questionId]["numCorrect"] += 1;
        } else {
            resultsByQuestion[questionId]["numIncorrect"] += 1;
        }
    }

    for (prop in resultsByQuestion) {
        sortedQuestionIds.push(prop);
    }
    sortedQuestionIds.sort();

    for (i = 0; i < sortedQuestionIds.length; i++) {
        questionId = sortedQuestionIds[i];
        results = resultsByQuestion[questionId];

        html = "<tr class='golfQuestion'>";
            html += "<td class='question'>" + results["question"] + "</td>";
            html += "<td class='correctAnswer'>" + results["correctAnswer"] + "</td>";
            html += "<td class='metric'>" + (results["numCorrect"] + results["numIncorrect"]) + "</td>";
            html += "<td class='metric'>" + results["numCorrect"] + "</td>";
            html += "<td class='metric'>" + results["numIncorrect"] + "</td>";
        html += "</tr>";

        $("table#golfQuestions").append(html);
    }
}

function RenderLocationData (err, result) {
    var statements,
        html,
        learners = [],
        learnerObjs = {},
        i,
        j,
        l,
        mbox;

    if (err !== null) {
        $('#locationCourseData').append("Error occurred: " + err);
        return;
    }

    statements = result.statements;

    html = "<table><tr class='labels'>";
    html += "<td class='name'>Learner</td>";
    html += "<td class='completion'>Completion</td>";
    html += "</tr>";

    for (i = 0; i < statements.length ; i++){
        mbox = statements[i].actor.mbox;
        if (typeof learnerObjs[mbox] === "undefined") {
            learners.push(mbox);
            learnerObjs[mbox] = {};
            learnerObjs[mbox].complete = 'incomplete';
        }
        if (typeof learnerObjs[mbox].name === "undefined" || learnerObjs[mbox].name === mbox) {
            learnerObjs[mbox].name = (statements[i].actor.name !== null) ? statements[i].actor.name : mbox;
        }
        if (statements[i].verb.id === "http://adlnet.gov/expapi/verbs/completed") {
            learnerObjs[mbox].complete = 'complete';
        }
    }

    for (j in learners) {
        l = learnerObjs[learners[j]];
        html += "<tr>";
        html += "<td class='name'>" + l.name + "</td>";
        html += "<td class='completion " + l.complete + "'>" + l.complete + "</td>";
        html += "<tr>";
    }
    html += "</table>";

    $("#locationCourseData").append(html);
}

function RequestLocations () {
    var getStatementsParams = {
            verb: {
                id: "http://activitystrea.ms/schema/1.0/at"
            }
        },
        tourActivity = new TinCan.Activity (
            {
                id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour"
            }
        );


    if (tincan.recordStores[0].version === "0.9" || tincan.recordStores[0].version === "0.95") {
        getStatementsParams.target = tourActivity;
    }
    else {
        getStatementsParams.activity = tourActivity;
        getStatementsParams.related_activities = true;
    }

    tincan.getStatements(
        {
            params: getStatementsParams,
            callback: RenderLocations
        }
    );
}

function RenderLocations (err, result) {
    var statements,
        resultsByLocationId = {},
        i,
        stmt,
        locationId,
        sortedLocationIds = [],
        loc,
        html;

    if (err !== null) {
        $('table#courseLocations').append("Error occurred: " + err);
        return;
    }

    statements = result.statements;

    for (i = 0; i < statements.length; i++) {
        stmt = statements[i];

        locationId = stmt.target.id;
        if (typeof resultsByLocationId[locationId] === "undefined") {
            resultsByLocationId[locationId] = {
                name: stmt.target.definition.getLangDictionaryValue("name"),
                description: stmt.target.definition.getLangDictionaryValue("description"),
                visitors: 0
            };
        }
        resultsByLocationId[locationId].visitors += 1;
    }

    for (prop in resultsByLocationId) {
        sortedLocationIds.push(prop);
    }
    sortedLocationIds.sort();

    for (i = 0; i < sortedLocationIds.length; i++) {
        locationId = sortedLocationIds[i];
        loc = resultsByLocationId[locationId];

        html = "<tr class='locationRow'>";
            html += "<td class='location'>" + loc.name + "<br/>";
            html += "<span class='description'>" + loc.description + "</span></td>";
            html += "<td class='metric'>" + loc.visitors + "</td>";
        html += "</tr>";

        $("table#courseLocations").append(html);
    }
}
