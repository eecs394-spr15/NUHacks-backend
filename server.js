// server.js

var express = require('express'),
	app = express();

app.set('port', (7000 || process.env.PORT));

app.get('/', function(req, res) {
	res.send('NUHacks backend reached.');
});

app.listen(app.get('port'), function(req, res) {
	console.log('App listening on port ' + app.get('port'));
});