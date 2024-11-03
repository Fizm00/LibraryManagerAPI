const Book = require('../models/bookModel');
const Category = require('../models/categoryModel');

exports.getCategoriesByBookId = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId).populate('categoryIds');
        if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });
        
        if (!book.categoryIds.length) {
            return res.status(404).json({ message: 'Tidak ada kategori untuk buku ini' });
        }

        res.status(200).json({ message: 'Kategori berhasil diambil', data: book.categoryIds });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil kategori', error });
    }
};

exports.addCategoryToBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const category = await Category.findById(req.body.categoryId);
        
        if (!book || !category) {
            return res.status(404).json({ message: 'Buku atau Kategori tidak ditemukan' });
        }

        if (book.categoryIds.includes(category._id)) {
            return res.status(400).json({ message: 'Kategori sudah ada untuk buku ini' });
        }

        book.categoryIds.push(category._id);
        await book.save();
        res.status(200).json({ message: 'Kategori berhasil ditambahkan ke buku', data: book });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menambahkan kategori ke buku', error });
    }
};

exports.removeCategoryFromBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });

        if (!book.categoryIds.includes(req.body.categoryId)) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan untuk buku ini' });
        }

        book.categoryIds = book.categoryIds.filter(catId => catId.toString() !== req.body.categoryId);
        await book.save();
        res.status(200).json({ message: 'Kategori berhasil dihapus dari buku', data: book });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menghapus kategori dari buku', error });
    }
};

exports.addCategoriesToBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });

        const categories = await Category.find({ '_id': { $in: req.body.categoryIds } });
        const categoryIds = categories.map(cat => cat._id);

        const newCategories = categoryIds.filter(catId => !book.categoryIds.includes(catId));
        book.categoryIds.push(...newCategories);
        await book.save();

        res.status(200).json({ message: 'Kategori berhasil ditambahkan secara massal ke buku', data: book });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menambahkan kategori secara massal ke buku', error });
    }
};
