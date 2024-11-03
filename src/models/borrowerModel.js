const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowerSchema = new Schema({
    name: { type: String, required: true },
    joinAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Borrower', borrowerSchema);
