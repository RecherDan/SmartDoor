var mraa = require('mraa'); //require mraa
var net = require('net');

//pins definitions
var analogPin1 = new mraa.Aio(1); //to indecat if the door isclose or not useing a potensiometer
var analogValue = analogPin1.read(); //read the value of the analog pin


function SmokeDetect() {
	//TODO: implement to return 1 if smoke detected or 0 else.
	
	return analogPin1.read().toString()
}

var server = net.createServer(function(socket) {
	socket.setKeepAlive(true,60000);
	socket.on('data', function(data) {
			socket.write(SmokeDetect());
	});
});

server.listen(6004, '127.0.0.1');