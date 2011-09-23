#Project Tin Can Prototypes
###Contact:
* tincan@scorm.com
* http://scorm.com/tincan

##Overview

###This package contains server and client prototypes for the Tin Can API.
* Client prototypes (see ClientPrototypes/index.html for details)
	* GolfExample_TCAPI : a converted SCORM course
	* JsTetris_TCAPI : Tetris
	* Locator_TCAPI : a location based activity
	* TinCanViewer : basic, and activity-specific reporting
* LRS server prototype -- provides LRS functionality, except as described in known issues section

##Client Samples Installation

Place the ClientPrototypes folder on a web server, and note the URL to ClientPrototypes/index.html.
This is the url you will launch in your browser to run the client prototypes.

##LRS (Learning Record Store) Installation
###Prerequisite Installation
* install mongodb (version 2.0.0 or later is required) http://www.mongodb.org/downloads
* install node.js https://github.com/joyent/node/wiki/Installation
* install the following node modules (npm install &lt;module&gt;)
	* async
	* mongodb (this is the node driver for mongodb, and is needed in addition to mongodb itself)

###LRS installation
* Place the LRS folder in the location you want to run the LRS

## Configuration
### LRS
* By default the LRS runs on port 8080 and is accessable from other machines. If you wish to use a different port, or restrict access to the local machine or a specific IP, edit LRS/config.js.
* Ensure mongo db (mongod) is running. You may simply launch a terminal and run mongod there.
* Launch the lrs. In the directory "TinCan_Prototypes/LRS", type: node lrs.js
	* You should see:
		* Mongo DB version: 2.0.0
		* DB 'local' Initialized

### Client
* If you will not be running the prototypes locally on the machine the LRS is installed on, then edit ClientPrototypes/prototypeConfig.js
and set PROTOTYPE_ENDPOINT to use hostname and port to reference where you have installed the LRS.
* Verify the LRS endpoint in your browser by navigating to the URL: &lt;endpoint&gt;/statements?limit=1
* You should be prompted to log in, the credentials are: test/password
* You should then see: [] , or JSON of a statement if statements have already been stored for this LRS.

## Known Issues
* LRS only has one login: test/password. It trusts this login to report any statement, about any user.
* Transitive equality of actors is not recognized
* The following API calls/modes are not implemented
	* GET http://example.com/TCAPI/Statements/ -- descendants parameter
	* POST http://example.com/TCAPI/Statements/ (POST mode of list statements)
	* GET http://example.com/TCAPI/activities/&lt;activity ID&gt;/state/&lt;actor&gt;[?since=&lt;timestamp&gt;]
	* GET http://example.com/TCAPI/activities/&lt;activity ID&gt;/profile[?since=&lt;timestamp&gt;]
	* GET http://example.com/TCAPI/activities/&lt;activity ID&gt;
	* GET http://example.com/TCAPI/actors/&lt;actor&gt;/profile[?since=&lt;timestamp&gt;]
	* GET http://example.com/TCAPI/actors/&lt;actor&gt;
	
	