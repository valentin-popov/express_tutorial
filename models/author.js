const config = require('../config');
const mongoose = config.mongoose;

const AuthorSchema = new mongoose.Schema({

	firstName: {
		type: String,
		minLength: 3,
		maxLength: 100,
		required: true
	},
	lastName: {
		type: String,
		minLength: 3,
		maxLength: 100,
		required: true
	},
	dateOfBirth: {
		type: Date
	},
	dateOfDeath: {
		type: Date
	}
});

AuthorSchema.virtual('url').get(function () {
	return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
