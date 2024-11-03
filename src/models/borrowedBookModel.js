const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowedBookSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowerId: { type: Schema.Types.ObjectId, ref: 'Borrower', required: true },
    borrowedAt: { type: Date, default: Date.now },
    expectedReturnedAt: { type: Date, required: true },
    returnedAt: { type: Date },
    fine: { type: Number, default: 0 },
    status: { type: String, default: 'active' }
});


module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);
