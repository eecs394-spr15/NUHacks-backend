// server.js

var express = require('express'),
	mongoose = require('mongoose'),
	Post = require('./Post.js'),
	db = mongoose.connection,
	bodyParser = require('body-parser'),
	_ = require('underscore'),
	app = express();

app.set('port', (process.env.PORT || 7000));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

db.on('error', console.error);
mongoose.connect('mongodb://liven93@gmail.com:nevilgeorge@proximus.modulusmongo.net:27017/saMan3oz');

app.get('/', function(req, res) {
	res.send('NUHacks backend reached.');
});

app.post('/post', function(req, res) {
	if (_.isEmpty(req.body)) {
		return res.send(404);
	}
	var newPost = new Post();
	newPost.title = req.body.title;
	newPost.author = req.body.author;
	newPost.save(function(err, post) {
		if (err) {
			res.send(500, err);
		}
		res.send(true);
	});
});

app.listen(app.get('port'), function(req, res) {
	console.log('App listening on port ' + app.get('port'));
});