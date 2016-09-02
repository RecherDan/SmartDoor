var mraa = require('mraa'); //require mraa
var net = require('net');

//pins definitions
var analogPin0 = new mraa.Aio(0); //to indecat if the door isclose or not useing a potensiometer
var analogValue = analogPin0.read(); //read the value of the analog pin


var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
			socket.write(analogPin0.read().toString());
	});
});

server.listen(6002, '127.0.0.1');