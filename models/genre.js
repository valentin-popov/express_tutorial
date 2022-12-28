const config = require('../config');
const mongoose = config.mongoose;
const GenreSchema = new mongoose.Schema({

    name: {
        type: String,
        minLenght: 3,
        maxLength: 100
    }
});

module.exports = mongoose.model('Genre', GenreSchema);