var mraa = require('mraa'); //require mraa
var minutes = 0.01, the_interval = minutes * 60 * 1000;
var analogPin1 = new mraa.Aio(3); //to indecat if the door isclose or not useing a potensiometer

setInterval(function() {
	console.log(analogPin1.read().toString());
}, the_interval);