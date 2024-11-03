const express = require("express");
const testRoutes = require("./test_routes");

const bookRoutes = require("./bookRoutes");
const authorRoutes = require("./authorRoutes");
const categoryRoutes = require("./categoryRoutes");
const borrowerRoutes = require("./borrowerRoutes");
const borrowedBookRoutes = require("./borrowedBookRoutes");
const bookCategoryRoutes = require("./bookCategoryRoutes");

const routes = express.Router();

routes.use("/books", bookRoutes);
routes.use("/authors", authorRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/borrowers", borrowerRoutes);
routes.use("/borrowed", borrowedBookRoutes);
routes.use("/book", bookCategoryRoutes);

routes.use(testRoutes);

module.exports = routes;
