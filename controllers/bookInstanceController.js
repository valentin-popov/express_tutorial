const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { globallyExcludedFields, bookInstanceViews } = require('../config');

const bookInstanceFormValidation = [
	body(['book', 'status'], 'Error! Book and status are required.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('dueBack')
		.optional({ checkFalsy: true})
];

async function validateFormOnError(req, res, next, formTitle, bookInstance, errors) {
	const books = await Book.find({}, 'title')
	.catch(e => {
		return next(e);
	});

return res.render(bookInstanceViews.form, {
	title: formTitle,
	books,
	bookInstance,
	selectedBook: req.body.book._id,
	errors: errors.errors,
});
}

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
	
	bookInstanceFormValidation,

	async (req, res, next) => {
		
		const bookInstance = new BookInstance({
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			dueBack: req.body.dueBack
		});

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return validateFormOnError(req, res, next, 'Create Book Instance', bookInstance, errors);
		}
		
		await bookInstance.save()
			.catch(e => {
				return next(e);
			});
		
		res.redirect(bookInstance.url);
	}
];

// Display BookInstance delete form on GET.
exports.deleteGet = async (req, res, next) => {
	const bookInstance = await BookInstance.findById(req.params.id, globallyExcludedFields)
		.populate({
			path: 'book',
			select: 'title -_id'
		});
	res.render(bookInstanceViews.detail, { 
		bookInstance, 
		remove: true 
	});

};

exports.deletePost = async (req, res, next) => {
	
	await BookInstance.deleteOne({_id: req.body.bookInstanceId})
		.catch(e => {
			return next(e);
		});
	res.redirect('/catalog/bookInstance');
};

// Display BookInstance update form on GET.
exports.updateGet = async (req, res, next) => {
	
	const [bookInstance, books] = await Promise.all([
		BookInstance.findById(req.params.id, globallyExcludedFields)
			.populate('book'),
		Book.find({}, globallyExcludedFields)
	]).catch(e => {
		return next(e);
	});
	
	res.render(bookInstanceViews.form, {
		title: 'Update book instance',
		bookInstance,
		books
	});
};

// Handle bookinstance update on POST.
exports.updatePost = [
	bookInstanceFormValidation,

	async (req, res, next) => {
		const errors = validationResult(req);
		
		const bookInstance = new BookInstance({
			_id: req.params.id,
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			dueBack: req.body.dueBack
		});
		
		if (!errors.isEmpty()) {
			return validateFormOnError(req, res, next, 'Update Book Instance', bookInstance, errors);
		}

		await BookInstance.updateOne({_id: req.params.id}, bookInstance).catch(exc => {
			return next(exc);
		});

		res.redirect(bookInstance.url);
	}

];
