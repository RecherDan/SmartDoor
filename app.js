var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//app.use(bodyparser({ extended: false }));


app.use(require('./router'));

app.listen(8080, function() {
	console.log("ready on port 8080");
});

