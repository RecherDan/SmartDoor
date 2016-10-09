var mraa = require('mraa'); //require mraa
var minutes = 0.000001, the_interval = minutes * 60 * 1000;
var analogPin1 = new mraa.Aio(2); //to indecat if the door isclose or not useing a potensiometer
var childProcess = require('child_process'), child;
var lastread = 1000;
var margin = 10;
setInterval(function() {
	if (((analogPin1.read() - lastread) > margin ) || ((analogPin1.read() - lastread) < -margin )) {
		console.log(analogPin1.read());
	}
	
	lastread = analogPin1.read();
	
	
}, the_interval);