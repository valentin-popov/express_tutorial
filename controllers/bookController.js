const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const { bookViews, globallyExcludedFields, indexView, mongoose } = require('../config');
const { body, validationResult } = require('express-validator');

exports.index = async (req, res, next) => {
	await Promise.all([
		Book.countDocuments({}).exec(),
		BookInstance.countDocuments({}).exec(),
		BookInstance.countDocuments({ status: 'Available' }).exec(),
		Author.countDocuments({}).exec(),
		Genre.countDocuments({}).exec()
	]).then((data) => {
		res.render(indexView, {
			title: 'Home',
			data: data
		});
	}).catch(e => {
		return next(e);
	});
};

// Display list of all books.
// Exclude specific fields, if any.
exports.list = (req, res, next) => {
	Book.find({}, 'title author')
		.sort({ title: 1 })
		.populate('author', globallyExcludedFields)
		.exec(function (err, books) {
			if (err) {
				return next(err);
			}
			res.render(bookViews.list, { title: 'Book List', bookList: books });
		});
};

// Returns an object containing info about the current book and all its instances.
exports.detail = async (req, res, next) => {
	const bookId = new mongoose.Types.ObjectId(req.params.id);
	try {
		let book;
		let bookInstances = await BookInstance.find({book: bookId}, globallyExcludedFields)
			.populate({
				path: 'book',
				populate: ['author', 'genre'],
				select: globallyExcludedFields
			})
			.exec();

		// Book has no instance - book must be read by id
		if (!bookInstances.length) {
			book = await Book.findById(bookId, globallyExcludedFields)
				.populate('author', globallyExcludedFields)
				.populate('genre', globallyExcludedFields)
				.exec();
		}
		res.render(bookViews.detail, { 
			book: book || bookInstances[0].book, 
			bookInstances: bookInstances 
		});
	} catch (e) {
		return next(e);
	}
};

// Display book create form on GET.
exports.createGet = async (req, res, next) => {
	await Promise.all([
		Author.find({}, globallyExcludedFields).exec(),
		Genre.find({}, globallyExcludedFields).exec()
	]).then(([authors, genres]) => {
		res.render(bookViews.form, {
			title: 'Create Book',
			authors,
			genres
		});
	}).catch(e => {
		return next(e);
	});
};

// Display book delete form on GET.
exports.deleteGet = async (req, res, next) => {
	const book = await Book.findById(req.params.id, 'title description')
		.exec()
		.catch(e => {
			return next(e);
		});
	if(!book) {
		return res.redirect('/catalog/book');
	}
	res.render(bookViews.delete, { book });
};

// Display book update form on GET.
exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Book update GET');
};



// Handle book create on POST.
exports.createPost = [
	
	(req, res, next) => {
		if (!Array.isArray(req.body.genre)) {
		  req.body.genre = [req.body.genre] || [];
		}
		next();
	},

	body(['title', 'author', 'isbn'], 'Error. Invalid field data!')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("genre.*").escape(),

	// Actual job happens here
	async (req, res, next) => {
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		// This object will be used whether there are errors or not.
		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			description: req.body.description,
			isbn: req.body.isbn,
			genre: req.body.genre
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.

			// Find all the authors
			const authors = await Author.find({},
				globallyExcludedFields).catch(exc => {
				return next(exc);
			});

			// Find all the genres
			let genres = await Genre.find({},
				globallyExcludedFields).catch(exc => {
				return next(exc);
			});
			
			// If the genres match the genres of the book, mark them as checked
			for (genre of genres) {
				if (book.genre.includes(genre._id)) {
					genre.checked = true;
				}
			}

			// The form is rendered again with sanitized data
			res.render(bookViews.form, {
				title: 'Create Book',
				book,
				authors,
				genres,
				errors
			});
		}
		
		await book.save().catch(exc => {
			return next(exc);
		});
		
		res.redirect(book.url);

	}
];

// Handle book delete on POST.
exports.deletePost = async (req, res) => {
	await Book.deleteOne({_id: req.body.bookId})
		.exec()
		.catch(e => {
			return next(e);
		});
	res.redirect('/catalog/book');
};

// Handle book update on POST.
exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Book update POST');
};
