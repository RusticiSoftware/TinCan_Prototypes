#Project Tin Can Prototypes
###Contact:
* tincan@scorm.com
* http://scorm.com/tincan

##Overview

###This package contains client prototypes for the Tin Can API.
* Client prototypes (see ClientPrototypes/index.html for details)
	* GolfExample\_TCAPI : a converted SCORM course
	* JsTetris\_TCAPI : Tetris
	* Locator\_TCAPI : a location based activity
	* TinCanViewer : basic, and activity-specific reporting

##Client Samples Installation

Place the ClientPrototypes folder on a web server, and note the URL to ClientPrototypes/index.html.
This is the url you will launch in your browser to run the client prototypes.

### Client
 * Copy the file ClientPrototypes/config.js.template to ClientPrototypes/config.js 
and set Config.endpoint to the LRS endpoint, including a trailing slash (ex: https://cloud.scorm.com/ScormEngineInterface/TCAPI/public/)
 * Verify the LRS endpoint in your browser by navigating to the URL: &lt;endpoint&gt;/statements?limit=1
	* You should be prompted to log in, the credentials are: test/password
	* You should then see: [] , or JSON of a statement if statements have already been stored for this LRS.
 * Launch: ClientPrototypes/index.html
