const config = require('../config');
const mongoose = config.mongoose;
const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
	book: {
		type: Schema.Types.ObjectId,
		ref: 'Book'
	},
	imprint: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true,
		enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
		default: 'Maintenance',
	},
	dueBack: {
		type: Date,
		default: Date.now
	}
});

BookInstanceSchema.virtual('url').get(function () {
	return `/catalog/bookInstance/${this._id}`;
});
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
