# Launcher Prototype

The launcher prototype simulates the role of an LMS in launching activities. It
issues an 'experienced' statement when the learner accesses the page and a
'launched' statement for each activity when launched.

##Recipe
All statements include the Recipe ID in the 'category' context activity list.

* http://id.tincanapi.com/recipe/tincan-prototypes/launcher/1

##Activities
Statements are grouped in the context of ```http://id.tincanapi.com/activity/tincan-prototypes```. They are 
categorized in the context of ```http://id.tincanapi.com/recipe/tincan-prototypes/golf/1``` and 
```http://id.tincanapi.com/activity/tincan-prototypes/launcher``` .

* http://id.tincanapi.com/activity/tincan-prototypes
* http://id.tincanapi.com/activity/tincan-prototypes/launcher
* http://id.tincanapi.com/activity/tincan-prototypes/launcher-template
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example
* http://id.tincanapi.com/activity/tincan-prototypes/tetris
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour

##Activity Types
The launcher plays the role of an LMS in launching the content. 

* http://id.tincanapi.com/activitytype/recipe
* http://id.tincanapi.com/activitytype/source
* http://id.tincanapi.com/activitytype/lms

##Verbs
The launcher itself is experienced. It launches the other content. 

* http://adlnet.gov/expapi/verbs/experienced
* http://adlnet.gov/expapi/verbs/launched

##Extensions
None.

# Golf Prototype
The Golf prototype is an example of a classic slide-slide-quiz e-learning course. This
recipe is based on emerging best practice for this type of course. 

##Recipe
All statements include the Recipe ID in the 'category' context activity list.

* http://id.tincanapi.com/recipe/tincan-prototypes/golf/1

##Activities
Statements are grouped in the context of ```http://id.tincanapi.com/activity/tincan-prototypes``` and ```http://id.tincanapi.com/activity/tincan-prototypes/golf-example```. They are categorized in the context of ```http://id.tincanapi.com/recipe/tincan-prototypes/golf/1``` and ```http://id.tincanapi.com/activity/tincan-prototypes/elearning```.

Activity ids indicate the position of each element within the course structure. 

* http://id.tincanapi.com/activity/tincan-prototypes/elearning
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Playing/OtherScoring
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Playing/Par
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Playing/Playing
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Playing/RulesOfGolf
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Playing/Scoring
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/HavingFun/HowToBeStylish
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/HavingFun/HowToHaveFun
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/HavingFun/MakeFriends
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Handicapping/CalculatingHandicap
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Handicapping/CalculatingScore
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Handicapping/Example
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Handicapping/Overview
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Etiquette/Course
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Etiquette/Distracting
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/Etiquette/Play
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.playing_1
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.playing_2
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.playing_3
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.playing_4
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.playing_5
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.etiquette_1
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.etiquette_2
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.etiquette_3
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.handicap_1
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.handicap_2
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.handicap_3
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.handicap_4
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.fun_1
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.fun_2
* http://id.tincanapi.com/activity/tincan-prototypes/golf-example/GolfAssessment/interactions.fun_3


##Activity Types
The course contains pages and an assessment which contains cmi interactions.

* http://id.tincanapi.com/activitytype/recipe
* http://id.tincanapi.com/activitytype/source
* http://adlnet.gov/expapi/activities/course
* http://activitystrea.ms/schema/1.0/page
* http://adlnet.gov/expapi/activities/assessment
* http://adlnet.gov/expapi/activities/cmi.interaction

##Verbs
The session is initizalized and terminated. The attempt is attempted, suspended, resumed then passed or failed. 
Pages are experienced and cmi intereactions are answered. 

* http://adlnet.gov/expapi/verbs/initialized
* http://adlnet.gov/expapi/verbs/terminated
* http://adlnet.gov/expapi/verbs/attempted
* http://adlnet.gov/expapi/verbs/resumed
* http://adlnet.gov/expapi/verbs/suspended
* http://adlnet.gov/expapi/verbs/passed
* http://adlnet.gov/expapi/verbs/failed
* http://adlnet.gov/expapi/verbs/experienced
* http://adlnet.gov/expapi/verbs/answered

##Extensions
None.

# Tetris Prototype
The Tetris prototype is an example of a game. Concepts from this recipe may be reflected in serious learning games, but
this recipe as a whole (the 'lines' extension in particular) is only suitable for Tetris style games.

##Recipe
All statements include the Recipe ID in the 'category' context activity list.

* http://id.tincanapi.com/recipe/tincan-prototypes/tetris/1

##Activities
Statements are grouped in the context of ```http://id.tincanapi.com/activity/tincan-prototypes``` and ```http://id.tincanapi.com/activity/tincan-prototypes/tetris```. They are categorized in the context of ```http://id.tincanapi.com/recipe/tincan-prototypes/tetris/1``` and ```http://id.tincanapi.com/activity/tincan-prototypes/tetris```.

The game as a whole has an activity id, and there's a category activity id for games based on this prototype. 

* http://id.tincanapi.com/activity/tincan-prototypes/tetris
* http://id.tincanapi.com/activity/tincan-prototypes/tetris-template

Each level of tetris has an activity id of ```http://id.tincanapi.com/activity/tincan-prototypes/tetris/levels/n``` where ```n``` is the level number. 

##Activity Types
The game has game levels. 

* http://id.tincanapi.com/activitytype/recipe
* http://id.tincanapi.com/activitytype/source
* http://activitystrea.ms/schema/1.0/game
* http://curatr3.com/define/type/level

##Verbs
The session is initialized and terminated when the gamer enters the page and when they turn tracking off and on. 
Games are attempted and then completed. Game levels are completed. 

* http://adlnet.gov/expapi/verbs/initialized
* http://adlnet.gov/expapi/verbs/terminated
* http://adlnet.gov/expapi/verbs/attempted
* http://adlnet.gov/expapi/verbs/completed

## Context Extensions
All statements within an attempt are grouped together by an attempt Id. Note that the
registration id stored in Context Registration field may include multiple attempts. 

* http://id.tincanapi.com/extension/attempt-id

## Result Extensions
Each completed game and game level records the actions per minute (apm) and number of lines achieved
by the player. 

* http://id.tincanapi.com/extension/apm
* http://id.tincanapi.com/extension/tetris-lines

# Locator Prototype
The locator prototype is an example of a learning activity that takes advantage on native features of a mobile device,
in this case the GPS. This recipe may be applicable to any location based activity. 

##Recipe
All statements include the Recipe ID in the 'category' context activity list.

* http://id.tincanapi.com/recipe/tincan-prototypes/locator/1

# Activities
Statements are grouped in the context of ```http://id.tincanapi.com/activity/tincan-prototypes``` and ```http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour```. They are categorized in the context of ```http://id.tincanapi.com/recipe/tincan-prototypes/locator/1``` and ```http://id.tincanapi.com/activity/tincan-prototypes/locator```.

The activity contains a number of places.

* http://id.tincanapi.com/activity/tincan-prototypes/locator
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/parthenon
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/country-music-hall-of-fame
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/the-frist
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/adventure-science-center
* http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/cheekwood

##Activity Types
The activity is a 'performance' type as the learner must perform a series of tasks, i.e. visiting places. 

* http://id.tincanapi.com/activitytype/recipe
* http://id.tincanapi.com/activitytype/source
* http://activitystrea.ms/schema/1.0/place
* http://adlnet.gov/expapi/activities/performance

##Verbs
The learner 'was at' each of the places. They attempt and complete the performance task. 

* http://activitystrea.ms/schema/1.0/at
* http://adlnet.gov/expapi/verbs/completed
* http://adlnet.gov/expapi/verbs/attempted

##Context Extensions
The position of the learner (rather than the place) is recorded in context extensions. This prototype does not use
these extensions within the activity definition to mark the position of the places, but it could. 

* http://id.tincanapi.com/extension/latitude
* http://id.tincanapi.com/extension/longitude
