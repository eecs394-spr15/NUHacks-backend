// server.js

var express = require('express'),
	mongoose = require('mongoose'),
	Post = require('./Post.js'),
	db = mongoose.connection,
	bodyParser = require('body-parser'),
	_ = require('underscore'),
	auth = require('./auth.js'),
	app = express();

app.set('port', (process.env.PORT || 7000));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

db.on('error', console.error);
// mongoose.connect('mongodb://liven93@gmail.com:nevilgeorge@proximus.modulusmongo.net:27017/saMan3oz');
// mongoose.connect('mongodb://localhost:27017/nuhacks');
mongoose.connect('mongodb://' + (process.env.DB_USER || auth.user) + ':' + (process.env.DB_PASS || auth.pass) + '@ds061691.mongolab.com:61691/nuhacks');

app.get('/', function(req, res) {
	res.send('NUHacks backend reached.');
});

app.get('/posts', function(req, res) {
	Post.find(function(err, posts) {
		if (err) {
			res.send(err);
		}
		res.json(posts);
	})
});

app.post('/post', function(req, res) {
	if (_.isEmpty(req.body)) {
		return res.send(404);
	}
	var newPost = new Post();
	newPost.text = req.body.text;
	newPost.author = req.body.author;
	newPost.save(function(err, post) {
		if (err) {
			res.send(500, err);
		}
		res.json(post);
	});
});

app.put('/post/:id', function(req, res) {
	var id = req.params.id;
	if (_.isEmpty(req.body)) {
		return res.send(400);
	}

	Post.findById(id, function(err, post) {
		if (err || !post) {
			return res.send(500);
		}

		post.upvotes = req.body.upvotes;
		post.downvotes = req.body.downvotes;
		post.text = req.body.text;

		post.save(function(err, post) {
			if (err) {
				return res.send(500);
			}
			res.json(post);
		});
	});
});

app.delete('/posts/:id', function(req, res) {
	var id = req.params.id;
	if (_.isEmpty(req.body)) {
		return res.send(400);
	}
});

app.listen(app.get('port'), function(req, res) {
	console.log('App listening on port ' + app.get('port'));
});