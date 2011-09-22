/*!
Scavenger JS - v0.0.1
Copyright (c) 2011 Brian Rogers - Rustici Software
MIT License?
*/

/*
Scavenger is a framework that wraps the html geolocation calls with 
an application that reads a list of Placemarks and tracks when the user
is within a certain range of each location. The current location can be 
persisted to another system (like SCORM LMS or Tin Can API) and the 
Placemarks can be checked to see if all have been visited for some type of 
completion.
*/
window.Scavenger = (function() {

    var version = '0.0.1',
    scavenger = {},
    cache = {};
    scavenger.locWatchId;
    scavenger.currentPosition = null;//actually holds a position object instead of the LatLng
    scavenger.watching = false;
    scavenger.cachedist = 0.1;// km
    scavenger.lastdist = 0.2;//trigger a geoloc
    scavenger.map;
    scavenger.lastloc = new google.maps.LatLng(0, 0); //start up at 0,0
	scavenger.config = {};
	
	scavenger.currentPlacemark = null;
	scavenger.onCurrentPlacemarkCallback = function(){};
	scavenger.onNoPlacemarksCallback = function(){};
	
	scavenger.visitedIcon = "img/visited.png";
	scavenger.notVisitedIcon = "img/notvisited.png";
	scavenger.currentVisitedIcon = "img/currentVisited.png";
	scavenger.currentNotVisitedIcon = "img/currentNotVisited.png";
	
    scavenger.geoLocationError = function(error) {
		//need to do something better here	
		alert(error.code);
	};

    scavenger.startWatchingLocation = function() {
        cache["locWatchId"] = navigator.geolocation.watchPosition(scavenger.showLocation, scavenger.locationError, {
            enableHighAccuracy: false
        });
        scavenger.watching = true;
    };

    scavenger.stopWatchingLocation = function() {
        navigator.geolocation.clearWatch(cache["locWatchId"]);
        scavenger.watching = false;
    };

    scavenger.showLocation = function(position) {
        scavenger.currentPosition = position;
        if (scavenger.lastdist > scavenger.cachedist) {
			//refresh the mapview
            scavenger.showMap(position.coords.latitude, position.coords.longitude);
			//update the location properties
            var newloc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            lastdist = scavenger.getStraightLineDistance(newloc, scavenger.lastloc);
            scavenger.lastloc = newloc;
			//check to see if we're close to a Placemark
			scavenger.currentPlacemark = null;
			for(pmrk in scavenger.config.Placemarks){
				
				var pmrkLoc = new google.maps.LatLng(scavenger.config.Placemarks[pmrk].lat, scavenger.config.Placemarks[pmrk].lng);
				
				if(scavenger.getStraightLineDistance(newloc, pmrkLoc) < scavenger.config.Placemarks[pmrk].visitrange) {
					scavenger.config.Placemarks[pmrk].gmarker.setIcon((scavenger.config.Placemarks[pmrk].visited) ? scavenger.currentVisitedIcon : scavenger.currentNotVisitedIcon); 
					scavenger.currentPlacemark = scavenger.config.Placemarks[pmrk];
					scavenger.onCurrentPlacemarkCallback();			
				} else {
					scavenger.config.Placemarks[pmrk].gmarker.setIcon((scavenger.config.Placemarks[pmrk].visited) ? scavenger.visitedIcon : scavenger.notVisitedIcon); 
				}
			}
			if (scavenger.currentPlacemark == null){
				scavenger.onNoPlacemarksCallback();
			}
        }
    };

    scavenger.attachInfoView = function(marker, number) {
		var contentString = '<div id="infoViewContent"><div>'+marker.title+'</div><div>' + scavenger.config.Placemarks[number].description + '</div></div>';
		
        var infowindow = new google.maps.InfoWindow(
        {
            content: contentString,
            size: new google.maps.Size(50, 50)
        });
        google.maps.event.addListener(marker, 'click',
        function() {
            infowindow.open(map, marker);
        });
    };

    scavenger.createMarker = function(results) {
        var marker = new google.maps.Marker({
            position: results["geometry"].location,
            title: results["name"]
        });

        marker.setMap(map);
    };

    scavenger.showMap = function(lat, lng) {

        var latlng = new google.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
		
		//should probably create this map_canvas div automatically
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        var homeMarker = new google.maps.Marker({
            position: latlng,
            title: scavenger.config.CurrentLocationTitle,
            icon: scavenger.config.CurrentLocationIcon,
			map: map
        });

        var infowindow = new google.maps.InfoWindow({
            content: scavenger.config.CurrentLocationTitle
        });

        google.maps.event.addListener(homeMarker, 'click',
        function() {
            infowindow.open(map, homeMarker);
        });

		var Placemarks = scavenger.config.Placemarks;

        for (itm in Placemarks) {
            Placemarks[itm].gmarker = new google.maps.Marker({
                position: new google.maps.LatLng(Placemarks[itm].lat, Placemarks[itm].lng),
                title: Placemarks[itm].name,
				icon: Placemarks[itm].icon,
				description: Placemarks[itm].description,
                map: map
            });
			cache["marker" + itm] = Placemarks[itm].gmarker;
            scavenger.attachInfoView(cache["marker" + itm], itm);
        }
        return this;
    };

    scavenger.getStraightLineDistance = function(location1, location2) {
        var R = 6371;
        //km
        var dLat = toRad(location2.lat() - location1.lat());
        var dLon = toRad(location2.lng() - location1.lng());
        var dLat1 = toRad(location1.lat());
        var dLat2 = toRad(location2.lat());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(dLat1) * Math.cos(dLat1) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
    };

	//private-ish
    function toRad(val) {
        return val.toRad();
    };


    // Converts numeric degrees to radians
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        };
    };

    return scavenger;

})();
