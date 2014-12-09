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
/*jslint devel: true, browser: true, sub: true, vars: true, white: true, forin: true, maxerr: 50, indent: 4 */
window.Scavenger = (function () {
    "use strict";

    var version = '0.0.1',
        scavenger = {},
        cache = {},
        newloc,
        distance,
        leastDistance,
        leastDistancePmrk;

    scavenger.currentPosition = null;//actually holds a position object instead of the LatLng
    scavenger.watching = false;
    scavenger.cachedist = 0.010; // 10 meters
    scavenger.lastdist = 0.2;//trigger a geoloc
    scavenger.lastloc = new google.maps.LatLng(0, 0); //start up at 0,0
    scavenger.config = {};

    scavenger.currentPlacemark = null;
    scavenger.onCurrentPlacemarkCallback = function () {};
    scavenger.onNoPlacemarksCallback = function () {};

    scavenger.visitedIcon = "img/visited.png";
    scavenger.notVisitedIcon = "img/notvisited.png";
    scavenger.currentVisitedIcon = "img/currentVisited.png";
    scavenger.currentNotVisitedIcon = "img/currentNotVisited.png";

    scavenger.useLocationCheat = false;
    scavenger.map = null;
    scavenger.homemarker = null;

    scavenger.locationError = function (error) {
        //need to do something better here  
        alert('Unable to detect lcoation, Error Code: ' + error.code);
    };

    scavenger.startWatchingLocation = function () {
        cache["locWatchId"] = navigator.geolocation.watchPosition(scavenger.showLocation, scavenger.locationError, {
            enableHighAccuracy: true
        });
        scavenger.watching = true;
        
        // watching doesn't always yeild an immediate position fix, request one.
        navigator.geolocation.getCurrentPosition(scavenger.showLocation,
                                                 scavenger.locationError,
                                                 {maximumAge:1000*60*5, timeout:1000*10});
    };

    scavenger.stopWatchingLocation = function () {
        navigator.geolocation.clearWatch(cache["locWatchId"]);
        scavenger.watching = false;
    };

    scavenger.showLocation = function (position) {
        var pmrk;

        if (scavenger.useLocationCheat ) {
            for(pmrk in scavenger.config.Placemarks) {
                if (!scavenger.config.Placemarks[pmrk].visited) {
                    position = {coords : {latitude: scavenger.config.Placemarks[pmrk].lat, longitude: scavenger.config.Placemarks[pmrk].lng}};
                    break;
                }
            }
        }
        scavenger.currentPosition = position;
        newloc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        scavenger.lastdist = scavenger.getStraightLineDistance(newloc, scavenger.lastloc);

        if (scavenger.lastdist > scavenger.cachedist) {
            //refresh the mapview
            scavenger.showMap(position.coords.latitude, position.coords.longitude);
            //update the location properties
            scavenger.lastloc = newloc;
        }

        //check to see if we're close to a Placemark
        scavenger.currentPlacemark = null;
        leastDistance = null;
        leastDistancePmrk = null;

        for(pmrk in scavenger.config.Placemarks) {
            var pmrkLoc = new google.maps.LatLng(scavenger.config.Placemarks[pmrk].lat, scavenger.config.Placemarks[pmrk].lng);
            distance = scavenger.getStraightLineDistance(newloc, pmrkLoc);
            if(distance < scavenger.config.Placemarks[pmrk].visitrange && (leastDistance === null || distance < leastDistance)) {
                leastDistance = distance;
                leastDistancePmrk = pmrk;
            }
            scavenger.config.Placemarks[pmrk].gmarker.setIcon((scavenger.config.Placemarks[pmrk].visited) ? scavenger.visitedIcon : scavenger.notVisitedIcon); 
        }
        if (leastDistancePmrk) {
            pmrk = leastDistancePmrk;
            scavenger.config.Placemarks[pmrk].gmarker.setIcon((scavenger.config.Placemarks[pmrk].visited) ? scavenger.currentVisitedIcon : scavenger.currentNotVisitedIcon); 
            scavenger.currentPlacemark = scavenger.config.Placemarks[pmrk];
            if (!scavenger.config.Placemarks[pmrk].visited) {
                // don't display save location button if already visited (confusing, implies the visit wasn't saved)
                scavenger.onCurrentPlacemarkCallback();
            }
        } else {
            scavenger.currentPlacemark = null;
            scavenger.onNoPlacemarksCallback();
        }
    };

    scavenger.attachInfoView = function (marker, number) {
        var contentString = '<div id="infoViewContent"><div>'+marker.title+'</div><div>' + scavenger.config.Placemarks[number].description + '</div></div>';

        var infowindow = new google.maps.InfoWindow(
        {
            content: contentString,
            size: new google.maps.Size(50, 50)
        });
        google.maps.event.addListener(marker, 'click',
        function () {
            infowindow.open(scavenger.map, marker);
        });
    };

    /*scavenger.createMarker = function (results) {
        var marker = new google.maps.Marker({
            position: results["geometry"].location,
            title: results["name"]
        });

        marker.setMap(map);
    };*/

    scavenger.showMap = function (lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 13,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var itm;

        if (scavenger.map)
        {
            // already created, just re-center
            scavenger.map.panTo(latlng);
            scavenger.homeMarker.setPosition(latlng);
        } else {
            //should probably create this map_canvas div automatically
            scavenger.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            var Placemarks = scavenger.config.Placemarks;
    
            for (itm in Placemarks) {
                Placemarks[itm].gmarker = new google.maps.Marker({
                    position: new google.maps.LatLng(Placemarks[itm].lat, Placemarks[itm].lng),
                    title: Placemarks[itm].name,
                    icon: Placemarks[itm].icon,
                    description: Placemarks[itm].description,
                    map: scavenger.map
                });
                cache["marker" + itm] = Placemarks[itm].gmarker;
                scavenger.attachInfoView(cache["marker" + itm], itm);
            }

            scavenger.homeMarker = new google.maps.Marker({
                position: latlng,
                title: scavenger.config.CurrentLocationTitle,
                icon: scavenger.config.CurrentLocationIcon,
                map: scavenger.map
            });
        }

        var infowindow = new google.maps.InfoWindow({
            content: scavenger.config.CurrentLocationTitle
        });

        google.maps.event.addListener(scavenger.homeMarker, 'click',
        function () {
            infowindow.open(scavenger.map, scavenger.homeMarker);
        });

        return this;
    };

    scavenger.getStraightLineDistance = function (location1, location2) {
        var R = 6371;
        //km
        var dLat = toRad(location2.lat() - location1.lat());
        var dLon = toRad(location2.lng() - location1.lng());
        var dLat1 = toRad(location1.lat());
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
    }

    // Converts numeric degrees to radians
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        };
    }

    return scavenger;

}());
