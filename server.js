// server.js

var express = require('express'),
	mongoose = require('mongoose'),
	Post = require('./Post.js'),
	db = mongoose.connection,
	bodyParser = require('body-parser'),
	_ = require('underscore'),
	// auth = require('./auth.js'),
	cors = require('cors'),
	app = express();

app.set('port', (process.env.PORT || 7000));
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())
app.use(cors());

db.on('error', console.error);
// mongoose.connect('mongodb://localhost:27017/nuhacks');
mongoose.connect('mongodb://' + (process.env.DB_USER || auth.user) + ':' + (process.env.DB_PASS || auth.pass) + '@ds061691.mongolab.com:61691/nuhacks');

app.get('/', function(req, res) {
	res.send('NUHacks backend reached.');
});


app.get('/post/:id', function(req, res) {
	var id =req.params.id;
	if (_.isEmpty(req.body)) {
		return res.send(404);
	}
	Post.findOne({_id : id})
	.exec(function(err,post){
		if (err) {
			res.send(500, err);
		}
		res.json(post);
	});
});


app.get('/posts/:page?', function(req, res) {
	var page = 0;
	var perPage = 12;
	if(req.params.page){
		page = parseInt(req.params.page);
	}

	Post.find()
	.sort('-upvotes')
	.limit(perPage)
    .skip(perPage * page)
    .exec(function(err, posts) {
		if (err) {
			res.send(err);
		}
		res.json(posts);
	});
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
	var update = {};
	if (_.isEmpty(req.body)) {
		return res.send(400);
	}

	console.log(req.body);
	if (req.body.upvotes)
		update.upvotes = parseInt(req.body.upvotes);
	if (req.body.downvotes) 
		update.downvotes = parseInt(req.body.downvotes);
	if (req.body.text) 
		update.text = req.body.text;

	Post.update({_id: id}, {$set: update}, function(err, post) {
		if (err) {
			return res.send(500, err);
		}
		res.json(true);
	});

});

app.delete('/post/:id', function(req, res) {
	var id = req.params.id;
	if (_.isEmpty(req.body)) {
		return res.send(400);
	}

	Post.findById(id, function(err, post) {
		if (err) {
			return res.send(500, err);
		}
		if (!post || _.isEmpty(post)) {
			return res.send(404);
		}

		post.remove(function(err) {
			if (err) {
				throw res.send(500, err);
			}
			res.send(true);
		});
	});
});

app.listen(app.get('port'), function(req, res) {
	console.log('App listening on port ' + app.get('port'));
});
