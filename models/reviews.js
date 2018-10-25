const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	reviewer_name:{
		type: String,
		required: true
	},
	review_title:{
		type: String,
		required: true
	},
	review_description:{
		type: String,
		required: true
	},
	rating:{
		type: String,
		required: true
	}
});

const Review = module.exports = mongoose.model('Review', ReviewSchema);