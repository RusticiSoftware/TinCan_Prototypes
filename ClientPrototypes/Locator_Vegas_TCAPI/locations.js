//config holds locations to visit
// 
var COURSE_NAME = "DevLearn Las Vegas 2011";
var COURSE_ID = "scorm.com/Course/DevLearnLasVegas.2";
var COURSE_DESC = "A tour of the Las Vegas Strip during DevLearn 2011.";

var config = {
	CurrentLocationTitle : "My Current Location",
	CurrentLocationIcon : "http:////maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
	Placemarks : [{
		name : "DevLearn 2011",
		icon : "img/notvisited.png",
		description : "If you want to know what’s coming next in the world of Learning and what the leaders in the field are thinking and doing, then you need to be at DevLearn — where the expanding possibilities for learning are defined. At the Aria Resort & Casio.",
		website : "http://www.elearningguild.com/DevLearn/content/1941/devlearn-2011-conference-and-expo---home/",
		lat: "36.10839",
		lng: "-115.17474",
		visited: false,
		visitrange: .75,
		tc_id: "scorm.com/Course/DevLearnLasVegas/DevLearn"
	},
		{
		name : "The Fountains of Bellagio",
		icon : "img/notvisited.png",
		description : "The Fountains of Bellagio is a vast, choreographed water feature with performances set to light and music. The performances take place in front of the Bellagio hotel. The show takes place every 30 minutes in the afternoons and early evenings, and every 15 minutes from 8 p.m. to midnight.",
		website : "http://en.wikipedia.org/wiki/Bellagio_(hotel_and_casino)#Fountains_of_Bellagio",
		lat: "36.112920",
		lng: "-115.173267",
		visited: false,
		visitrange: .05,
		tc_id: "scorm.com/Course/DevLearnLasVegas/Fountains"
	},
		{
		name : "The Paris Las Vegas Eiffel Tower",
		icon : "img/notvisited.png",
		description : "Stand at the foot of the Pasis Las Vegas half scale, 541-foot tall replica of the Eiffel Tower.",
		website : "http://en.wikipedia.org/wiki/Paris_Las_Vegas",
		lat: "36.112467",
		lng: "-115.172612",
		visited: false,
		visitrange: .05,
		tc_id: "scorm.com/Course/DevLearnLasVegas/EiffelTower"
	},
	{
		name : "The Giant Harley-Davidson",
		icon : "img/notvisited.png",
		description : "Bursting through the front façade of the Harley-Davidson Café is a (7.1:1) scale replica Sportster, costing over $ 750,000 to manufacture, with a front tire weighing 1,200 lbs. and measuring 32 linear feet. Known to have caused traffic to halt on Las Vegas Boulevard when first erected September of 1997.",
		website : "http://www.harley-davidsoncafe.com",
		lat: "36.107885",
		lng: "-115.172511",
		visited: false,
		visitrange: .05,
		tc_id: "scorm.com/Course/DevLearnLasVegas/HarleyDavidson"
	},
	{
		name : "The New York-New York Statue of Liberty",
		icon : "img/notvisited.png",
		description : "New York-New York uses the New York City influence of its name in several ways. Its architecture is meant to evoke the New York City skyline; the hotel includes several towers configured to resemble New York City towers such as the Empire State Building and the Chrysler Building.In front of the property is a lake representing New York Harbor, with a 150-foot-tall replica of the Statue of Liberty.",
		website : "http://en.wikipedia.org/wiki/New_York-New_York_Hotel_%26_Casino",
		lat: "36.101086",
		lng: "-115.173354",
		visited: false,
		visitrange: .05,
		tc_id: "scorm.com/Course/DevLearnLasVegas/NYNY"
	},
	{
		name : "The MGM Grand Lion",
		icon : "img/notvisited.png",
		description : "The MGM Grand is the second largest hotel in the world and largest hotel resort complex in the United States in front of The Venetian. The MGM Grand was the largest hotel in the world when it opened in 1993. Originally, the main entrance on the Strip was inside the mouth of a giant cartoon-like version of MGM's mascot, Leo the Lion, but this entrance feature was changed to a more traditional entrance; many Chinese gamblers avoided the casino or entered through the back entrance, due to the feng shui belief that entering the mouth of the lion was bad luck. In 1998, a large bronze statue of Leo was added above the entrance to keep with the MGM Lion theme, while not scaring away their more superstitious guests. The statue weighs 50 tons, and at 45 feet tall, on a 25-foot pedestal, is the largest bronze statue in the U.S.",
		website : "http://en.wikipedia.org/wiki/MGM_Grand_Las_Vegas",
		lat: "36.101178",
		lng: "-115.172483",
		visited: false,
		visitrange: .05,
		tc_id: "scorm.com/Course/DevLearnLasVegas/LeoLion"
	},
		{
		name : "McCarran International Airport",
		icon : "img/notvisited.png",
		description : "McCarran is the principal commercial airport serving Las Vegas. It covers an area of 2,800 acres and has four runways. McCarran has more than 1,234 slot machines throughout the airport terminals.",
		website : "http://en.wikipedia.org/wiki/Las_Vegas_Airport",
		lat: "36.08483",
		lng: "-115.1516",
		visited: false,
		visitrange: 2,
		tc_id: "scorm.com/Course/DevLearnLasVegas/Airport"
	},
	]
};
Scavenger.config = config;
