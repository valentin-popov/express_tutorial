const Author = require('../models/author');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { globallyExcludedFields, authorViews } = require('../config');

const authorFormValidation = [
	body(['firstName', 'lastName'], 'Error! First and last name must be specified.')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body(['dateOfBirth', 'dateOfDeath'], 'Invalid date')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate()
];

function getShortDate(date) {
	return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}

async function renderFormOnError(res, next, formTitle, author, errors) {
	// The form is rendered again with sanitized data
	return res.render(authorViews.form, {
		title: formTitle,
		author, 
		errors: errors.errors
	});
}

// Display list of all Authors.
exports.list = (req, res, next) => {
	Author.find({}, globallyExcludedFields)
		.sort({ lastName: 1 })
		.exec(function (err, authors) {
			if (err) {
				return next(err);
			}
			res.render(authorViews.list, { title: 'Author List', authorList: authors });
		});
};

// Display details about a specific author
// and titles of the books written by them.
// The author details are extracted from books info
// to avoid two different requests.
exports.detail = (req, res, next) => {
	Book.find({ author: req.params.id }, 'title description author')
		.populate('author', globallyExcludedFields)
		.exec(function (err, result) {
			if (err) {
				return next(err);
			}
			if (result.length) {
				res.render(authorViews.detail, {
					author: result[0].author,
					books: result
				});
			} else {
				// no books written by this author - read author by id
				Author.findById(req.params.id, globallyExcludedFields)
					.exec(function (err, result) {
						if (err) {
							return next(err);
						}
						res.render(authorViews.detail, {
							author: result,
							books: []
						});
					});
			}
		});
};

// Display Author create form on GET.
exports.createGet = (req, res) => {
	res.render(authorViews.form, {
		title: 'Create Author'
	});
};

// Handle Author create on POST.
exports.createPost = [

	authorFormValidation,

	// Process request after validation and sanitization.
	async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			return res.render(authorViews.form, {
				title: 'Create Author',
				author: req.body,
				errors: errors.array(),
			});
		}

		// Search for existing author
		const foundAuthor = await Author.findOne({
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}).catch(exc => {
			return next(exc);
		});

		if (foundAuthor) {
			return res.redirect(foundAuthor.url);
		}

		// Create an Author object with escaped and trimmed data.
		const author = new Author({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dateOfBirth: req.body.dateOfBirth,
			dateOfDeath: req.body.dateOfDeath,
		});

		await author.save().catch(exc => {
			return next(exc);
		});
		
		res.redirect(author.url);
	}

];

// Display Author delete form on GET.
exports.deleteGet = async (req, res, next) => {
	
	// check if there are books written by this author
	// and read author by id
	await Promise.all([
		Author.findById(req.params.id, globallyExcludedFields),
		Book.find({ author: req.params.id }, 'title')
	]).then(([author, books]) => {
		// findById does not throw error on empty result
		if (!author) {
			return res.redirect('/catalog/author');
		}
		res.render(authorViews.delete, {
			author,
			books
		});
	}).catch(e => {
		return next(e);
	});
};

// Handle Author delete on POST.
exports.deletePost = async (req, res, next) => {
	await Author.deleteOne({_id: req.body.authorId})
		.exec()
		.catch(e => {
			return next(e);
		});
	res.redirect('/catalog/author');
};

// Display Author update form on GET.
exports.updateGet = async (req, res, next) => {
	let author = await Author.findById(req.params.id, globallyExcludedFields).catch(e => {
		return next(e);
	});
	if (!author) {
		return res.redirect('/catalog/author');
	}

	res.render(authorViews.form, {
		title: 'Update Author',
		author
	});

};

// Handle Author update on POST.
exports.updatePost = [
	authorFormValidation,

	async (req, res, next) => {
		const errors = validationResult(req);
		
		const author = new Author({
			_id: req.params.id,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dateOfBirth: req.body.dateOfBirth,
			dateOfDeath: req.body.dateOfDeath
		});
		
		if (!errors.isEmpty()) {
			return renderFormOnError(res, next, 'Update Author', author, errors);
		}

		await Author.updateOne({_id: req.params.id}, author).catch(exc => {
			return next(exc);
		});
		res.redirect(author.url);

	}
];
