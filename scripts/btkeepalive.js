var minutes = 0.5, the_interval = minutes * 60 * 1000;
var SerialPort = require('serialport');
var port = new SerialPort('/dev/rfcomm0');
	port.on('open', function() {
			console.log("connected");
	});
	 
	// open errors will be emitted as an error event 
	port.on('error', function(err) {
	  console.log('Error: ', err.message);
	})	
	port.on('data', function(data) {
		console.log('bt recived:' + data);
	});

setInterval(function() {
	port.write("1");
}, the_interval);