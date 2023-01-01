const Genre = require('../models/genre');
const Book = require('../models/book');
const config = require('../config');

// Display list of all Genre.
exports.list = (req, res, next) => {
	Genre.find({}, config.globallyExcludedFields)
		.sort({ name: 1 })
		.exec((err, result) => {
			if (err) {
				return next(err);
			}
			res.render('genreList', { title: 'Genres', genreList: result });
		});
};

// Display detail page for a specific Genre.
exports.detail = (req, res, next) => {

	Book.find({ genre: req.params.id }, config.globallyExcludedFields)
		.populate('genre', config.globallyExcludedFields)
		.exec((err, result) => {
			if (err) {
				return next(err);
			}
			if (result.length) {
				result[0].genre.forEach((genreItem) => {
					if (genreItem._id == req.params.id) {
						res.render('genreDetail', {
							genre: genreItem.name,
							books: result
						});
					}
				});
			} else {
				// genre has no books
				// genre.readById
				Genre.findById(req.params.id, config.globallyExcludedFields)
					.exec((err, result) => {
						if (err) {
							return next(err);
						}
						res.render('genreDetail', {
							genre: result.name,
							books: []
						});
					});
			}
		});
};

// Display Genre create form on GET.
exports.createGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update POST');
};
