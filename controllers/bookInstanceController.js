const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { globallyExcludedFields, bookInstanceViews } = require('../config');

// Display list of all BookInstances.
exports.list = (req, res, next) => {
	BookInstance.find({})
		.sort({ 'book.title': 1 })
		.populate('book')
		.exec(function (err, bookInstances) {
			if (err) {
				return next(err);
			}
			res.render(bookInstanceViews.list, {
				title: 'Book Instance List',
				bookInstanceList: bookInstances
			});
		});
};

// Display detail page for a specific BookInstance.
exports.detail = async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id, globallyExcludedFields)
		.populate('book', globallyExcludedFields)
		.exec()
		.catch(e => {
			return next(e);
		});
	res.render(bookInstanceViews.detail, { bookInstance });
};

// Display BookInstance create form on GET.
exports.createGet = async (req, res, next) => {
	const books = await Book.find({}, 'title').exec()
		.catch(e => {
			return next(e);
		});
	res.render(bookInstanceViews.form, {
		title: 'Create Book Instance',
		books
	});
};

// Handle BookInstance create on POST.
exports.createPost = [
	body(['book', 'status'], 'Error! Book and status are required.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('dueBack')
		.optional({ checkFalsy: true}),

	async (req, res, next) => {
		
		const bookInstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			dueBack: req.body.dueBack
		});

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized data.
			const books = await Book.find({}, 'title')
				.exec()
				.catch(e => {
					return next(e);
				});
			
			res.render(bookInstanceViews.form, {
				title: 'Create Book Instance',
				books,
				bookInstance,
				selectedBook: req.body.book._id,
				errors: errors.array(),
			});
			return;
		}
		
		await bookInstance.save()
			.catch(e => {
				return next(e);
			});
		
		res.redirect(bookInstance.url);
	}
];

// Display BookInstance delete form on GET.
exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance update POST');
};
