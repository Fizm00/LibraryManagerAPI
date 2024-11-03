const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: 'Kategori berhasil diambil', data: categories });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil kategori', error });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        res.status(200).json({ message: 'Kategori berhasil diambil', data: category });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil kategori', error });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ message: 'Kategori berhasil dibuat', data: category });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat membuat kategori', error });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updatedData = { ...req.body, updatedAt: Date.now() };
        const category = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        res.status(200).json({ message: 'Kategori berhasil diperbarui', data: category });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat memperbarui kategori', error });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menghapus kategori', error });
    }
};

exports.getCategoryUsageStats = async (req, res) => {
    try {
        const categories = await Category.find().populate('books');
        const stats = categories.map(category => ({
            category: category.name,
            count: category.books.length
        }));

        res.status(200).json({ message: 'Statistik penggunaan kategori berhasil diambil', data: stats });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil statistik penggunaan kategori', error });
    }
};
