var mraa = require('mraa'); //require mraa
var analogPin0 = new mraa.Aio(0); //to indecat if the door isclose or not useing a potensiometer
var analogValue = analogPin0.read(); //read the value of the analog pin
var maxStepsToOpen = 7000; // how many maximum!!!!! steps to open or close the door the motore sould do
var half_time_Of_Sleep_Between_Steps=1200;

for(var i = 0; i < maxStepsToOpen ;i++){
    chek=analogPin0.read();
     console.log("analog data from A0: %d",chek);
     sleep.usleep(2*half_time_Of_Sleep_Between_Steps) ;
 }