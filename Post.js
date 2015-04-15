// Post.js - A MongoDB Schema

var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

var postSchema = new mongoose.Schema({
    title: String,
	text: String,
	author: String,
	date: { type: Date, default: Date.now },
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 },
	tags: [String]
});

postSchema.plugin(textSearch);
postSchema.index({tags: "text"});
module.exports = mongoose.model('Post', postSchema);