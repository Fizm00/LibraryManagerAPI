const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    summary: { type: String },
    stocks: [
        {
            book_identifier: { type: String, required: true },
            status: { type: String, enum: ['available', 'borrowed'], default: 'available' }
        }
    ],
    authorId: { type: Schema.Types.ObjectId, ref: 'Author', required: true }
});

module.exports = mongoose.model('Book', bookSchema);
