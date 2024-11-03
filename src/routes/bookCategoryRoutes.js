const express = require("express");
const bookCategoryController = require("../controllers/bookCategoryController");

const router = express.Router();

router.get("/:bookId", bookCategoryController.getCategoriesByBookId);
router.post("/:bookId", bookCategoryController.addCategoryToBook);
router.delete("/:bookId", bookCategoryController.removeCategoryFromBook);
router.post("/:bookId/multiple", bookCategoryController.addCategoriesToBook);

module.exports = router;