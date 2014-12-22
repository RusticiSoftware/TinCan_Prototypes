//
// config holds locations to visit
//
var COURSE_NAME = "Nashville Museums Tour";
var COURSE_ID = "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour";
var COURSE_DESC = "An exploration of museums in the greater Nashville TN area.";

var config = {
    CurrentLocationTitle : "My Current Location",
    CurrentLocationIcon : "http://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
    Placemarks : [
        {
            name : "Parthenon",
            icon : "img/notvisited.png",
            description : "The Parthenon in Nashville, Tennessee is a full-scale replica of the original Parthenon in Athens. It was built in 1897 as part of the Tennessee Centennial Exposition. The Parthenon serves as the city of Nashville's art museum.",
            website : "http://www.nashville.gov/parthenon/",
            lat: "36.1499",
            lng: "-86.812935",
            visited: false,
            visitrange: .25,
            tc_id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/parthenon"
        },
        {
            name : "Country Music Hall of Fame and Museum",
            icon : "img/notvisited.png",
            description : "The mission of the Country Music Hall of Fame and Museum is to identify and preserve the evolving history and traditions of country music and to educate its audiences. Functioning as a local history museum and as an international arts organization, the Country Music Hall of Fame and Museum serves visiting and non-visiting audiences including fans, students, scholars, members of the music industry.",
            website : "http://countrymusichalloffame.org/",
            lat: "36.158589",
            lng: "-86.776505",
            visited: false,
            visitrange: .25,
            tc_id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/country-music-hall-of-fame"
        },
        {
            name : "Frist Center For The Visual Arts",
            icon : "img/notvisited.png",
            description : "The Frist Center opened in April 2001, and since that time has hosted a spectacular array of art from the region, the country, and around the world.",
            website : "http://fristcenter.org/",
            lat: "36.157974",
            lng: "-86.783924",
            visited: false,
            visitrange: .25,
            tc_id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/the-frist"
        },
        {
            name : "Adventure Science Center",
            icon : "img/notvisited.png",
            description : "Igniting curiosity and inspiring the discovery of science for all ages.",
            website : "http://www.adventuresci.com/",
            lat: "36.146677",
            lng: "-86.775620",
            visited: false,
            visitrange: .25,
            tc_id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/adventure-science-center"
        },
        {
            name : "Cheekwood-Botanical Garden & Museum of Art",
            icon : "img/notvisited.png",
            description : "Cheekwood is a 55-acre botanical garden and art museum located on the historic Cheek estate. Cheekwood exists to celebrate and preserve its landscape, buildings, art and botanical collections and, through these unique means, provide an inspiring place for visitors to explore their connections with art, nature and the environment.",
            website : "http://www.cheekwood.org/",
            lat: "36.086841",
            lng: "-86.874014",
            visited: false,
            visitrange: .25,
            tc_id: "http://id.tincanapi.com/activity/tincan-prototypes/nashville-museums-tour/cheekwood"
        }
    ]
};

Scavenger.config = config;
