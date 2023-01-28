const Genre = require('../models/genre');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { globallyExcludedFields, genreViews } = require('../config');

async function renderFormOnError(res, formTitle, genre, errors) {
	// The form is rendered again with sanitized data
	return res.render(genreViews.form, {
		title: formTitle,
		genre, 
		errors: errors.errors
	});
}

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
				result[0].genre.forEach((genre) => {
					if (genre._id == req.params.id) {
						res.render(genreViews.detail, {
							genre,
							books: result
						});
					}
				});
			} else {
				// genre has no books
				// genre.readById
				Genre.findById(req.params.id, globallyExcludedFields)
					.exec((err, genre) => {
						if (err) {
							return next(err);
						}
						res.render(genreViews.detail, {
							genre,
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
			
			return res.render(genreViews.form, {
				title: 'Create Genre',
				genre: req.body,
				errors: errors.array()
			});
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
exports.deleteGet = async (req, res) => {
	await Promise.all([
		Genre.findById(req.params.id, globallyExcludedFields),
		Book.find({ genre: req.params.id }, globallyExcludedFields)
	]).then(([genre, books]) => {
		if (!genre) {
			return res.redirect('/catalog/genre');
		}
		res.render(genreViews.delete, {
			genre, 
			books
		});
	}).catch(e => {
		return next(e);
	});
};

// Handle Genre delete on POST.
exports.deletePost = async (req, res, next) => {
	await Genre.deleteOne({ _id: req.body.genreId})
		.exec()
		.catch(e => {
			return next(e);
		});
	res.redirect('/catalog/genre');
};

// Display Genre update form on GET.
exports.updateGet = async(req, res, next) => {
	let genre = await Genre.findById(req.params.id, globallyExcludedFields).catch(e => {
		return next(e);
	});
	if (!genre) {
		return res.redirect('/catalog/genre');
	}

	res.render(genreViews.form, {
		title: 'Update Genre',
		genre
	});
};

// Handle Genre update on POST.
exports.updatePost = async (req, res, next) => {
	const errors = validationResult(req);
	const genre = new Genre({
		_id: req.params.id,
		name: req.body.name
	});

	if (!errors.isEmpty()) {
		return renderFormOnError(res, next, 'Update Genre', genre, errors);
	}
	
	await Genre.updateOne({_id: req.params.id}, genre).catch(e => {
		return next(e);
	});
	
	res.redirect(genre.url);
};
