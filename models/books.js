const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	author:{
		type: String,
		required: true
	},
	publisher:{
		type: String,
		required: true
	},
	category:{
		type: String,
		required: true
	},
	isbn:{
		type: String,
		required: true
	},
	year:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	price:{
		type: String,
		required: true
	},
	image_url:{
		type: String,
		required: false
	}

});

const Book = module.exports = mongoose.model('Book', BookSchema);