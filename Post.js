// Post.js - A MongoDB Schema

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var postSchema = new Schema({
	title: String,
	author: String,
	date: { type: Date, default: Date.now },
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 },
	tags: [String]
});

module.exports = mongoose.model('Post', postSchema);