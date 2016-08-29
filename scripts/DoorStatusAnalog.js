var mraa = require('mraa'); //require mraa

var analogPin0 = new mraa.Aio(0); //to indecat if the door isclose or not useing a potensiometer
var analogValue = analogPin0.read(); //read the value of the analog pin
var maxStepsToOpen = 7000; // how many maximum!!!!! steps to open or close the door the motore sould do



var net = require('net');

var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
			socket.write('status' + analogPin0.read());
	});
});

server.listen(6001, '127.0.0.1');