const Author = require('../models/authorModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/authors');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const handleErrorResponse = (res, message, error, statusCode = 500) => {
    res.status(statusCode).json({ message, error });
};

exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json({ message: 'Authors retrieved successfully', data: authors });
    } catch (error) {
        handleErrorResponse(res, 'Error retrieving authors', error);
    }
};

exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ message: 'Author not found' });
        res.status(200).json({ message: 'Author retrieved successfully', data: author });
    } catch (error) {
        handleErrorResponse(res, 'Error retrieving author', error);
    }
};

exports.createAuthor = async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).json({ message: 'Author created successfully', data: author });
    } catch (error) {
        handleErrorResponse(res, 'Error creating author', error);
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) return res.status(404).json({ message: 'Author not found' });
        res.status(200).json({ message: 'Author updated successfully', data: author });
    } catch (error) {
        handleErrorResponse(res, 'Error updating author', error);
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) return res.status(404).json({ message: 'Author not found' });
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, 'Error deleting author', error);
    }
};

exports.uploadAuthorProfilePicture = (req, res) => {
    upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Upload failed', error: err.message });
        }
        try {
            const author = await Author.findById(req.params.id);
            if (!author) return res.status(404).json({ message: 'Author not found' });

            author.profilePicture = req.file.path; 
            await author.save();

            res.status(200).json({ message: 'Profile picture uploaded successfully', data: author });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
        }
    });
};