var mraa = require('mraa'); //require mraa
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var analogPin1 = new mraa.Aio(2); //to indecat if the door isclose or not useing a potensiometer
var childProcess = require('child_process'), child;
var KnockCount = 0;
var lastKnock = 0;
var minThreshold = 100;
var MaxtimeBetweenKnocks = 3000;
var MintimeBetweenKnocks = 500;
setInterval(function() {
	console.log(analogPin1.read());
}, the_interval);