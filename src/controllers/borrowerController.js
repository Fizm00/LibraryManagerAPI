const Borrower = require('../models/borrowerModel');

exports.getAllBorrowers = async (req, res) => {
    try {
        const borrowers = await Borrower.find();
        res.status(200).json({ message: 'Peminjam berhasil diambil', data: borrowers });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil peminjam', error });
    }
};

exports.getBorrowerById = async (req, res) => {
    try {
        const borrower = await Borrower.findById(req.params.id);
        if (!borrower) return res.status(404).json({ message: 'Peminjam tidak ditemukan' });
        res.status(200).json({ message: 'Peminjam berhasil diambil', data: borrower });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil peminjam', error });
    }
};

exports.createBorrower = async (req, res) => {
    try {
        const borrower = new Borrower(req.body);
        await borrower.save();
        res.status(201).json({ message: 'Peminjam berhasil dibuat', data: borrower });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat membuat peminjam', error });
    }
};

exports.updateBorrower = async (req, res) => {
    try {
        const borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!borrower) return res.status(404).json({ message: 'Peminjam tidak ditemukan' });
        res.status(200).json({ message: 'Peminjam berhasil diperbarui', data: borrower });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat memperbarui peminjam', error });
    }
};

exports.deleteBorrower = async (req, res) => {
    try {
        const borrower = await Borrower.findByIdAndDelete(req.params.id);
        if (!borrower) return res.status(404).json({ message: 'Peminjam tidak ditemukan' });
        res.status(200).json({ message: 'Peminjam berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menghapus peminjam', error });
    }
};
