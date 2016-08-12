var Cylon = require('cylon');
var sleep = require('sleep'); //require mraa


// geting the  command line arguments exemple in " http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js "
process.argv.forEach(function (val, index, array) {  
        if (index ==2 )  { commendstr =val}});
var command;



Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },

  devices: {
    lcd: { driver: 'lcd' }
  },

  work: function(my) {
     
	my.lcd.displayOff();
	my.lcd.displayOn();
    my.lcd.print(commendstr);
  }
}).start(); 

 sleep.usleep(10000000);
 process.exit();

