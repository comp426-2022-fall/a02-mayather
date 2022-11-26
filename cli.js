#!/usr/bin/env node

//dependencies
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

//processing import
const args = minimist(process.argv.slice(2));

//help text
const helpText = 
`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.`;

//default showing help text
if (args.h) {
    console.log(helpText);
    process.exit(0);
}

//set timezone, lat, long, url
const timezone = args.z ? args.z : moment.tz.guess();
const latitude = args.n || args.s * -1;;
const longitude = args.e || args.w * -1;
const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone;

// Make a request
const response = await fetch(url);

// Get the data from the request
const data = await response.json();

// if there's -j, show json and exit
if (args.j) {
    console.log(data);
    process.exit(0);
}

//Create the response text using conditional statements
const days = args.d 

if (data.daily.precipitation_hours[days] != 0.0) {
    console.log("You might need your galoshes ");
} else{
    console.log("You will not need your galoshes ");
}

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}