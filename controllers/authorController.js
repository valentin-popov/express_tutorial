const Author = require('../models/author');
const Book = require('../models/book');
const config = require('../config');

// Display list of all Authors.
exports.list = (req, res, next) => {
	Author.find({}, config.globallyExcludedFields)
		.sort({ lastName: 1 })
		.exec(function (err, authors) {
			if (err) {
				return next(err);
			}
			res.render('authorList', { title: 'Author List', authorList: authors });
		});
};

// Display details about a specific author
// and titles of the books written by them.
// The author details are extracted from books info
// to avoid two different requests.
exports.detail = (req, res, next) => {
	// const authorId = new config.mongoose.Types.ObjectId(req.params.id);
	Book.find({ author: req.params.id }, 'title description author')
		.populate('author', config.globallyExcludedFields)
		.exec(function (err, result) {
			if (err) {
				return next(err);
			}
			if (result.length) {

				res.render('authorDetail', {
					author: result[0].author,
					books: result
				});
			} else {
				// no books written by this author - read author by id
				Author.findById(req.params.id, config.globallyExcludedFields)
					.exec(function (err, result) {
						if (err) {
							return next(err);
						}
						res.render('authorDetail', {
							author: result,
							books: []
						});
					});
			}
		});
};

// Display Author create form on GET.
exports.createGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Author update POST');
};
