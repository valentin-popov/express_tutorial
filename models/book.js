const config = require('../config');
const mongoose = config.mongoose;
const Schema = mongoose.Schema;

const BookSchema = new Schema({

    title: {
        type: String,
        minLength: 3,
        maxLength: 100,
        required: true
    },
    description: {
        type: String, 
        minLength: 10,
        maxLength: 1000,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
    },
    
    genre: [{
        type: Schema.Types.ObjectId,
        ref: "Genre"
    }]
});

module.exports = mongoose.model('Book', BookSchema);
