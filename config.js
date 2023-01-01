// main configuration file

// fields that must not be returned in db read response
const globallyExcludedFields = '-__v';
const mongoose = require('mongoose');
const dbURL = '';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
	mongoose,
	globallyExcludedFields
};
