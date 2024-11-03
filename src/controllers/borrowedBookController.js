const BorrowedBook = require('../models/borrowedBookModel');

exports.borrowBook = async (req, res) => {
    try {
        const { bookId, borrowerId, expectedReturnedAt } = req.body;

        if (!bookId || !borrowerId || !expectedReturnedAt) {
            return res.status(400).json({ message: 'ID Buku, ID Peminjam, dan Tanggal Pengembalian diperlukan.' });
        }

        const borrowedBook = new BorrowedBook({
            bookId,
            borrowerId,
            expectedReturnedAt,
            status: 'active'
        });

        await borrowedBook.save();
        res.status(201).json({ message: 'Buku berhasil dipinjam', data: borrowedBook });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat meminjam buku', error });
    }
};

exports.getActiveBorrowedBooks = async (req, res) => {
    try {
        const activeBorrowedBooks = await BorrowedBook.find({ status: 'active' })
            .populate('bookId')
            .populate('borrowerId');

        res.status(200).json({ message: 'Data peminjaman buku aktif berhasil diambil', data: activeBorrowedBooks });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengambil data peminjaman buku aktif', error });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { bookId, borrowerId } = req.body;

        const borrowedBook = await BorrowedBook.findOne({ bookId, borrowerId, status: 'active' });
        if (!borrowedBook) return res.status(404).json({ message: 'Data peminjaman buku tidak ditemukan' });

        const returnedAt = new Date();
        borrowedBook.returnedAt = returnedAt;
        borrowedBook.status = 'returned';

        let fine = 0;
        if (returnedAt > borrowedBook.expectedReturnedAt) {
            const oneDay = 24 * 60 * 60 * 1000;
            const daysLate = Math.ceil((returnedAt - borrowedBook.expectedReturnedAt) / oneDay);
            fine = daysLate * 5000;
        }

        borrowedBook.fine = fine;
        await borrowedBook.save();

        res.status(200).json({
            message: 'Buku berhasil dikembalikan',
            data: borrowedBook,
            fine
        });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat mengembalikan buku', error });
    }
};

exports.updateBorrowedBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const borrowedBook = await BorrowedBook.findByIdAndUpdate(id, updatedData, { new: true });
        if (!borrowedBook) return res.status(404).json({ message: 'Data peminjaman buku tidak ditemukan' });

        res.status(200).json({ message: 'Data peminjaman buku berhasil diperbarui', data: borrowedBook });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat memperbarui data peminjaman buku', error });
    }
};

exports.deleteBorrowedBook = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowedBook = await BorrowedBook.findByIdAndDelete(id);
        if (!borrowedBook) return res.status(404).json({ message: 'Data peminjaman buku tidak ditemukan' });

        res.status(200).json({ message: 'Data peminjaman buku berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Kesalahan saat menghapus data peminjaman buku', error });
    }
};
