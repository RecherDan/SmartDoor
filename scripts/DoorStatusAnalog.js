var mraa = require('mraa'); //require mraa
var net = require('net');
var Firebase = require("firebase");
var doorconfig = require('./config'); // door configuration

var config = {
	    apiKey: "AIzaSyCRpzldmrnwtOf7M_TBBNGFofyswZ2IifQ",
	    authDomain: "smartdoor-2f29b.firebaseapp.com",
	    databaseURL: "https://smartdoor-2f29b.firebaseio.com",
	    storageBucket: "",
	    messagingSenderId: "693048105512"
	  };
Firebase.initializeApp(config);
var database = Firebase.database();

//pins definitions
var analogPin0 = new mraa.Aio(0); //to indecat if the door isclose or not useing a potensiometer
var analogValue = analogPin0.read(); //read the value of the analog pin
var minutes = 0.1, the_interval = minutes * 60 * 1000;

//MotorStatus read Potentiometer Status and consider if door is "Open", "Close" or in the "Middle"
function MotorStatus() {
	var PotentiometerRead = PotentiometerStatus.read();
	if ( PotentiometerRead < doorconfig.ThrasholdConsiderdOpen ) return "Open";
	else if ( PotentiometerRead > doorconfig.ThrasholdConsiderdClose ) return "Close";
	return "Middle";
}

setInterval(function() {
	  var rootref = database.ref().child('doors');
	  var doorref = rootref.child(doorconfig.doorname);
	  doorref.child('doorcurrentstatus').set(MotorStatus());
}, the_interval);