var mraa = require('mraa'); //require mraa
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var myDigitalPin6 = new mraa.Gpio(6);
myDigitalPin6.dir(mraa.DIR_IN);
var childProcess = require('child_process'), child;
var lastread = 1000;
var margin = 10;
setInterval(function() {
	console.log(myDigitalPin6.read());
	
	
}, the_interval);