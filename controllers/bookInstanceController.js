const BookInstance = require('../models/bookInstance');
const config = require('../config');

// Display list of all BookInstances.
exports.list = (req, res, next) => {
	BookInstance.find({})
		.sort({ 'book.title': 1 })
		.populate('book')
		.exec(function (err, bookInstances) {
			if (err) {
				return next(err);
			}
			res.render('bookInstanceList', {
				title: 'Book Instance List',
				bookInstanceList: bookInstances
			});
		});
};

// Display detail page for a specific BookInstance.
exports.detail = async (req, res, next) => {
	try {
		const bookInstance = await BookInstance.findById(req.params.id, config.globallyExcludedFields)
			.populate('book', config.globallyExcludedFields)
			.exec();
		res.render('bookInstanceDetail', { bookInstance });
	} catch (e) {
		return next(e);
	}
};

// Display BookInstance create form on GET.
exports.createGet = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.createPost = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.deleteGet = (req, res) => {
	res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
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
