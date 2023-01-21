// main configuration file

// fields that must not be returned in db read response
const globallyExcludedFields = '-__v';
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const dbURL = '';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(error => console.error(error)); 

// author views
const authorViews = {
	list: 'authorList',
	detail: 'authorDetail',
	form: 'authorForm',
	delete: 'authorDelete'
};

// book views
const bookViews = {
	list: 'bookList',
	detail: 'bookDetail',
	form: 'bookForm',
	delete: 'bookDelete'
};

// bookInstance views
const bookInstanceViews = {
	list: 'bookInstanceList',
	detail: 'bookInstanceDetail',
	form: 'bookInstanceForm',
	delete: 'bookInstanceDelete'
};

// genre
const genreViews = {
	list: 'genreList',
	detail: 'genreDetail',
	form: 'genreForm',
	delete: 'genreDelete'
};

const indexView = 'index';

module.exports = {
	mongoose,
	globallyExcludedFields,
	indexView,
	authorViews,
	bookViews,
	bookInstanceViews,
	genreViews
};
