// Post.js - A MongoDB Schema

var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	text: String,
	author: String,
	date: { type: Date, default: Date.now },
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 },
	tags: [String]
});

module.exports = mongoose.model('Post', postSchema);