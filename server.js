// server.js

var express = require('express'),
	mongoose = require('mongoose'),
	textSearch = require('mongoose-text-search'),
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
	var id = req.params.id;

	Post.findOne({_id : id})
	.exec(function(err,post){
		if (err) {
			res.send(500, err);
		}
		res.json(post);
	});
});


app.get('/search/:query', function(req, res){
	options = {
		limit: 10
	};
	Post.textSearch(req.params.query, options, function(err, results){
		if (err) {
			return res.send(500, err);
		}
		lst = [];
		results.results.forEach(function(elem, i, array){
			lst.push(elem["obj"]);
		})
		res.json(lst);
	});
});


app.get('/tags', function(req, res){
	o = {};
	o.map = function () {
		if(typeof(this.tags) == "string"){
			emit(this.tags, 1);
		} else{
			this.tags.forEach(function(elem, i, array){
				emit(elem, 1);
			});
		}
	};
	o.reduce = function (k, vals) {
		return vals.length;
	};
	Post.mapReduce(o, function (err, results) {
		if (err) {
			return res.send(500, err);
		}
		res.json(results);
	});
});

app.get('/posts/:page/:endpage?', function(req, res) {
	var sortby = "-upvotes"
	if(sortby == "-upvotes" || sortby == "-date"){
		sortby = req.query.sortby;
	}
	var page = 0;
	var perPage = 12;
	var lim = perPage;
	if(req.params.page){
		page = parseInt(req.params.page);
		if(req.params.endpage){
			endpage = parseInt(req.params.endpage);
			if(endpage < page){
				return res.send(500);
			} else{
				lim = perPage * (1 + endpage - page);
			}
		}
	}
    
	Post.find()
	.sort(sortby)
	.limit(lim)
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
	newPost.title = req.body.title;
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
	if (req.body.tags) 
		update.tags = req.body.tags;

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
