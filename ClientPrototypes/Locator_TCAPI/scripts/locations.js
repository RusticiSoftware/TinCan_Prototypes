//config holds locations to visit
// 
var COURSE_NAME = "Tin Can Locator Example";
var COURSE_ID = "scorm.com/Course/TinCanLocatorExample";
var COURSE_DESC = "A sample course to display the usefulness of Tin Can and a locator course.";

var config = {
	CurrentLocationTitle : "My Current Location",
	CurrentLocationIcon : "http:////maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
	Placemarks : [{
		name : "Rustici Software",
		icon : "img/notvisited.png",
		description : "Work the day away...",
		lat: "35.940735",
		lng: "-86.827888",
		visited: false,
		visitrange: 1,
		tc_id: "scorm.com/Location/RusticiSoftware"
	}]
};

Scavenger.config = config;

/*
{
	name : "First Location",
	icon : "img/notvisited.png",
	description : "",
	lat: "35.8254962",
	lng: "-86.4597999",
	visited: false,
	visitrange: 1,
	tc_id: "scorm.com/Location/FirstLocation"
},
{
	name : "Liberty Park",
	icon : "img/notvisited.png",
	description : "Play some disc golf here!",
	lat: "35.930927",
	lng: "-86.802208",
	visited: false,
	visitrange: 1,
	tc_id: "scorm.com/Location/LibertyPark"
},
*/