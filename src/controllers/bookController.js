const Book = require('../models/bookModel');
const multer = require('multer');
const path = require('path');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authorId');
        res.status(200).json({message: 'Books retrieved successfully', data: books});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving books', error});
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('authorId');
        if (!book) return res.status(404).json({message: 'Book not found'});
        res.status(200).json({message: 'Book retrieved successfully', data: book});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving book', error});
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({message: 'Book created successfully', data: book});
    } catch (error) {
        res.status(500).json({message: 'Error creating book', error});
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!book) return res.status(404).json({message: 'Book not found'});
        res.status(200).json({message: 'Book updated successfully', data: book});
    } catch (error) {
        res.status(500).json({message: 'Error updating book', error});
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({message: 'Book not found'});
        res.status(200).json({message: 'Book deleted successfully', data: book});
    } catch (error) {
        res.status(500).json({message: 'Error deleting book', error});
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/covers');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('cover');

exports.uploadBookCover = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload gagal', error: err });
        }

        try {
            const bookId = req.body.bookId;
            const coverPath = req.file.path;

            const updatedBook = await Book.findByIdAndUpdate(
                bookId,
                { $set: { 'Stocks.$[elem].book_cover': coverPath } },
                { new: true, arrayFilters: [{ 'elem.book_identifier': req.body.book_identifier }] }
            );

            if (!updatedBook) {
                return res.status(404).json({ message: 'Buku tidak ditemukan' });
            }

            return res.status(200).json({ message: 'Sampul buku berhasil diupload', data: updatedBook });
        } catch (error) {
            return res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
        }
    });
};