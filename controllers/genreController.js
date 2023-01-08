const Genre = require('../models/genre');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { globallyExcludedFields, genreViews } = require('../config');

// Display list of all Genre.
exports.list = (req, res, next) => {
	Genre.find({}, globallyExcludedFields)
		.sort({ name: 1 })
		.exec((err, result) => {
			if (err) {
				return next(err);
			}
			res.render(genreViews.list, { title: 'Genres', genreList: result });
		});
};

// Display detail page for a specific Genre.
exports.detail = (req, res, next) => {

	Book.find({ genre: req.params.id }, globallyExcludedFields)
		.populate('genre', globallyExcludedFields)
		.exec((err, result) => {
			if (err) {
				return next(err);
			}
			if (result.length) {
				result[0].genre.forEach((genreItem) => {
					if (genreItem._id == req.params.id) {
						res.render(genreViews.detail, {
							genre: genreItem.name,
							books: result
						});
					}
				});
			} else {
				// genre has no books
				// genre.readById
				Genre.findById(req.params.id, globallyExcludedFields)
					.exec((err, result) => {
						if (err) {
							return next(err);
						}
						res.render(genreViews.detail, {
							genre: result.name,
							books: []
						});
					});
			}
		});
};

// Display Genre create form on GET.
exports.createGet = (req, res) => {
	res.render(genreViews.form, {
		title: 'Create Genre'
	});
};

// Handle Genre create on POST.
exports.createPost = [
	body('name', 'Error! Genre name required').trim().isLength({ min: 1 }).escape(),
	async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// render the view again
			res.render(genreViews.form, {
				title: 'Create Genre',
				genre: req.body,
				errors: errors.array()
			});
			return;
		} 

		// check if genre already exists
		try {
			const foundGenre = await Genre.findOne({
				name: req.body.name
			}).exec();
			
			if (foundGenre) {
				// redirect to detail page
				res.redirect(foundGenre.url);
			} else {
				const genre = new Genre({
					name: req.body.name
				});
				await genre.save();
				res.redirect(genre.url);
			}
		} catch(e) {
			return next(e);
		}
	}
];


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
