const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

let bookSchema = new Schema({
    bookId:{
        type: ObjectId,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    pages : {
        type: Number
    },
    author : {
        type: String
    }
});

module.exports = mongoose.model('Book', bookSchema);