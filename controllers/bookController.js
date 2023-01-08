const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const { bookViews, globallyExcludedFields, indexView, mongoose } = require('../config');

exports.index = async (req, res) => {
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
exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Book delete GET');
};

// Display book update form on GET.
exports.updateGet = (req, res) => {
	res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book create on POST.
exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: Book create POST');
};

// Handle book delete on POST.
exports.deletePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Book delete POST');
};

// Handle book update on POST.
exports.updatePost = (req, res) => {
	res.send('NOT IMPLEMENTED: Book update POST');
};
