const express = require('express');
const router = express.Router();

const Book = require('../models/books');
const Review = require('../models/reviews');
const Customer = require('../models/customers');
const Store = require('../models/stores');


//search books without param
router.get('/books', (req, res, next) => {
	Book.find((err, books) => {
		res.json(books);
	});
});

//search book by different params- title, author, publisher, category, isbn
router.get('/books/:search_param', (req, res, next) => {
	Book.find({ 
		$or:[
			{title: req.params.search_param}, 
			{author: req.params.search_param},
			{publisher: req.params.search_param},
			{category: req.params.search_param},
			{isbn: req.params.search_param}
		]},(err, books) => {
		res.json(books);
	});
});

// get book details
router.get('/bookDetails/:id', (req, res, next) => {
	Book.find({_id:req.params.id},(err, books) => {
		res.json(books);
	});
});

//add books
router.post('/book', (req, res, next) => {
	//logic to add books
	let newBook = new Book({
		title: req.body.title,
		author:req.body.author,
		publisher:req.body.publisher,
		category:req.body.category,
		isbn:req.body.isbn,
		year: req.body.year,
		description: req.body.description,
		price: req.body.price,
		rent_price: req.body.rent_price,
		image_url: req.body.image_url
	});

	newBook.save((err, book) => {
		if(err){
			res.json({msg: 'Failed to add book'});
		}
		else{
			res.json({msg: 'Book added succesfully'});
		}
	});

});

//delete books
router.delete('/book/:id', (req, res, next) => {
	Book.remove({_id:req.params.id},(err, result) => {
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
})


//add reviews
router.post('/review', (req, res, next) => {
	let newReview = new Review({
		title: req.body.title,
		reviewer_name:req.body.reviewer_name,
		review_title:req.body.review_title,
		review_description:req.body.review_description,
		rating:req.body.rating
	});

	newReview.save((err, review) => {
		if(err){
			res.json({msg: 'Failed to add review'});
		}
		else{
			res.json({msg: 'Review added succesfully'});
		}
	});

});

// get reviews
router.get('/reviews/:title', (req, res, next) => {
	Review.find({title:req.params.title},(err, review) => {
		res.json(review);
	});
});

//add customer
router.post('/customer', (req, res, next) => {
	let newCustomer = new Customer({
		first_name: req.body.first_name,
		last_name:req.body.last_name,
		password:req.body.password,
		email_id:req.body.email_id,
		phone:req.body.phone,
		addr_line_1:req.body.addr_line_1,
		addr_line_2:req.body.addr_line_2,
		city:req.body.city,
		state:req.body.state,
		zip:req.body.zip,
		country:req.body.country
	});

	newCustomer.save((err, customer) => {
		if(err){
			res.json({msg: 'Failed to add customer'});
		}
		else{
			res.json({msg: 'Customer added succesfully'});
		}
	});

});

//authenticate user
router.get('/customer/:email', (req, res, next) => {
	Customer.find(
			{email_id: req.params.email}
		,(err, customer) => {
		res.json(customer);
	});
});


//add store
router.post('/store', (req, res, next) => {
	let newStore = new Store({
		store_id:req.body.store_id,
		addr_line_1:req.body.addr_line_1,
		addr_line_2:req.body.addr_line_2,
		city:req.body.city,
		state:req.body.state,
		zip:req.body.zip,
		country:req.body.country,
		phone:req.body.phone
	});

	newStore.save((err, store) => {
		if(err){
			res.json({msg: 'Failed to add store'});
		}
		else{
			res.json({msg: 'Store added succesfully'});
		}
	});

});


// get stores
router.get('/stores/', (req, res, next) => {
	Store.find((err, store) => {
		res.json(store);
	});
});

// get stores
router.get('/stores/:city', (req, res, next) => {
	Store.find({city:new RegExp('^'+req.params.city+'$','i')},(err, store) => {
		res.json(store);
	});
});

module.exports = router;
