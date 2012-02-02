#Project Tin Can Prototypes
###Contact:
* tincan@scorm.com
* http://scorm.com/tincan

##Overview

###This package contains server and client prototypes for the Tin Can API.
* Client prototypes (see ClientPrototypes/index.html for details)
	* GolfExample\_TCAPI : a converted SCORM course
	* JsTetris\_TCAPI : Tetris
	* Locator\_TCAPI : a location based activity
	* TinCanViewer : basic, and activity-specific reporting

##Client Samples Installation

Place the ClientPrototypes folder on a web server, and note the URL to ClientPrototypes/index.html.
This is the url you will launch in your browser to run the client prototypes.

### Client
 * If you will not be running the prototypes locally on the machine the LRS is installed on, then edit ClientPrototypes/prototypeConfig.js
and set PROTOTYPE_ENDPOINT to use hostname and port to reference where you have installed the LRS.
 * Verify the LRS endpoint in your browser by navigating to the URL: &lt;endpoint&gt;/statements?limit=1
	* You should be prompted to log in, the credentials are: test/password
	* You should then see: [] , or JSON of a statement if statements have already been stored for this LRS.
 * Launch: ClientPrototypes/index.html (from your web server in your browser, not from the file system) 
