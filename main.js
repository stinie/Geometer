/*
 * 
 * Find more about this app by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license
 * http://miniapps.co.uk/license/
 * 
 * Version 1.3.1 - Last updated: November 18 2010
 * 
 */

var geoUtilityApp = {

updateLocation: null,

//initializes watchPosition.
init: function () {

	this.updateLocation = navigator.geolocation.watchPosition(geoUtilityApp.success, geoUtilityApp.fail, {enableHighAccuracy: true});

},

success: function (position) {

	var timeStamp = null,
	heading = null,
	accuracy = null,
	altAccuracy = null,
	speed = null;
	
	//we must check to see whether or not each piece of data has been returned in the success call.
	//if a piece of data has been returned, we then update the meter readout.

	if(!position.coords.latitude) {
		document.querySelector('#latitude').innerHTML = 'Calculating';
	}
	else {
		document.querySelector('#latitude').innerHTML = position.coords.latitude;
	}

	if(!position.coords.longitude) {
		document.querySelector('#longitude').innerHTML = 'Calculating';
	}
	else {
		document.querySelector('#longitude').innerHTML = position.coords.longitude;
	}
	
	if(!position.coords.accuracy) {
		document.querySelector('#accuracy').innerHTML = 'Calculating';
	}
	else {
		accuracy = Math.round(position.coords.accuracy);
		document.querySelector('#accuracy').innerHTML = accuracy + ' meters';
	}

	if(!position.coords.altitude) {
		document.querySelector('#altitude').innerHTML = 'Calculating';
	}
	else {
		document.querySelector('#altitude').innerHTML = position.coords.altitude + ' meters';
	}

	if(!position.coords.altitudeAccuracy) {
		document.querySelector('#altitudeAccuracy').innerHTML = 'Calculating';
	}
	else {
		altAccuracy = Math.round(position.coords.altitudeAccuracy);
		
		document.querySelector('#altitudeAccuracy').innerHTML = altAccuracy + ' meters';
	}

	if(!position.coords.speed) {
		document.querySelector('#speed').innerHTML = 'Calculating';
	}
	else {
		speed = Math.round(position.coords.speed);
		
		document.querySelector('#speed').innerHTML = speed + ' meters per second';
	}

	if(!position.coords.heading) {
		document.querySelector('#heading').innerHTML = 'Calculating';
	}
	else {
		//convert heading into compass direction.
		heading = geoUtilityApp.getHeading(position.coords.heading);
		
		document.querySelector('#heading').innerHTML = heading;
	}
	if(!position.timestamp) {
		document.querySelector('#timestamp').innerHTML = 'Calculating';
	}
	else {
		//convert timestamp to be more human readable.
		timeStamp = geoUtilityApp.formatTimeStamp(position.timestamp);
		
		document.querySelector('#timestamp').innerHTML = timeStamp;
	}
	
	//update 'map' button href.
	geoUtilityApp.setMapURL(position.coords.latitude, position.coords.longitude);
	
	//update 'Mail location info' button href.
    geoUtilityApp.updateMail(position.coords.latitude, position.coords.longitude, accuracy, position.coords.altitude, altAccuracy, speed, heading, timeStamp);
	
},

//called if watchPosition returns an error.
fail: function(error) {

	switch(error.code) // Returns 0-3
	{
		case 0:
			// unknown error alert error message
			alert('An unknown error occured');
			break;
 
		case 1:
			// permission denied alert error message
			alert('Permission denied by user');
			break;

		case 2:
			// position unavailable error message
			alert('Position unavailable');
			break;

		case 3:
			// timeout error message
			alert('The request timed out');
			break;
	}
},


//function that stops watchPosition, if we wished to call it
stop: function() {

	navigator.geolocation.clearWatch(this.updateLocation);
},

//updates the href of the 'Map' button.
setMapURL: function(latitude, longitude) {

	var URL = 'http://maps.google.com/maps?q=' + latitude + ',' + longitude;
	
	document.querySelector('#map').onclick = function() {
		window.open(URL);	
	};
},

//updates the href of the 'Mail location info' button.
updateMail: function(latitude, longitude, accuracy, altitude, altAccuracy, speed, heading, timeStamp) {

	(!latitude) ? latitude = '?' : latitude = latitude;
	(!longitude) ? longitude = '?' : longitude = longitude;
	(!accuracy) ? accuracy = '?\n' : accuracy += ' meters\n';
	(!altitude) ? altitude = '?\n' : altitude += ' meters\n';
	(!altAccuracy) ? altAccuracy = '?\n' : altAccuracy +=  ' meters\n';
	(!speed) ? speed = '?\n' : speed += ' meters per second\n';
	(!heading) ? heading = '?\n' : heading += '\n';
	(!timeStamp) ?timeStamp = '?\n\n' : timeStamp += '\n\n';

    	var subject = 'My location';
    	var body = 'Latitude: ' + latitude + '\nLongitude: ' + longitude + '\nAccuracy: ' + accuracy + 'Altitude: ' + altitude + 'Altitude accuracy: ' + altAccuracy + 'Speed: ' + speed + 'Heading: ' + heading + 'Timestamp: ' + timeStamp + 'http://maps.google.com/maps?q=' + latitude + ',' + longitude + '\n';
	
	document.querySelector('#maillink').href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
},

//toggles the large 'Mail location info' button.
sendMail: function() {
	
	var mailLink = document.querySelector('#maillist');

	if (mailLink.style.display === 'none') {
   		   mailLink.style.display = 'block';
   	}
   	else {
   		mailLink.style.display = 'none';
   	}
},

//takes a variable that is degrees clockwise from true north and returns the relevant compass direction.
getHeading: function(heading) {

	if (((heading > 0) && (heading <= 22.5)) || ((heading > 337.5) && (heading <= 0))) {
        return 'North';
    }
    else if ((heading > 22.5) && (heading <= 67.5)) {
        return 'North East'
    }
    else if ((heading > 67.5) && (heading <= 112.5)) {
        return 'East'
    }
    else if ((heading > 112.5) && (heading <= 157.5)) {
        return 'South East'
    }
    else if ((heading > 157.5) && (heading <= 202.5)) {
        return 'South'
    }
    else if ((heading > 202.5) && (heading <= 247.5)) {
        return 'South West'
    }
    else if ((heading > 247.5) && (heading <= 292.5)) {
        return 'West'
    }
    else if ((heading > 292.5) && (heading <= 373.5)) {
        return 'North West'
    }
},

//takes a Unix timestamp and returns a formatted, human readable timestamp.
formatTimeStamp: function(timestamp) {

	var date = new Date(timestamp);

	var month = date.getUTCMonth() + 1,
	day = date.getUTCDate(),
	year = date.getUTCFullYear(),
	hours = date.getUTCHours(),
	minutes = date.getUTCMinutes(),
	seconds = date.getUTCSeconds(),
	
	formattedTime =  year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;

	return formattedTime;
}

};

function loaded() {

	//test to see if browser supports geo location api.
	if (navigator.geolocation) { 
 
		//hide the address bar if visible.
		window.scrollTo(0,0);

		//hide the mail list items button.
		document.querySelector('#maillist').style.display = 'none';

		//initialise the app.	
		geoUtilityApp.init();

		//add an event listener for when the mail button is clicked.
		document.querySelector('#mail').addEventListener('click', geoUtilityApp.sendMail, false);
 
	} else {  
		alert('Your browser does not support Geolocation API. Sorry!');
	}
}

window.addEventListener("load", loaded, true);