const express = require("express");
const borrowedBookController = require("../controllers/borrowedBookController");

const router = express.Router();

router.post("/books", borrowedBookController.borrowBook);
router.get("/books/list", borrowedBookController.getActiveBorrowedBooks);
router.post("/books/return", borrowedBookController.returnBook);
router.put("/books/:id", borrowedBookController.updateBorrowedBook);
router.delete("/books/:id", borrowedBookController.deleteBorrowedBook);
module.exports = router;
