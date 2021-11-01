const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controllers/categories.controllers");

categoriesRouter.route("/").get(getAllCategories);


module.exports = categoriesRouter;
