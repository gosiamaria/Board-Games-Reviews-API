const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controllers/categories.controllers");
const { handleNotAllowedMethods } = require('../controllers/errors.controllers');


categoriesRouter.route("/")
.get(getAllCategories)
.all(handleNotAllowedMethods)

module.exports = categoriesRouter;
