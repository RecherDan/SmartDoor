var zetta = require('zetta');
var LED = require('zetta-led-edison-driver');
var Buzzer = require('zetta-buzzer-edison-driver');

zetta()
  .name('FirstName-LastName')
  .use(LED, 13)
  .use(Buzzer, 3)
  .link('http://hello-zetta.herokuapp.com/')
  .listen(1337, function(){
     console.log('Zetta is running at http://127.0.0.1:1337');
});
