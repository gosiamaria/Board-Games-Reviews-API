const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controllers/categories.controllers");

categoriesRouter.route("/")
.get(getAllCategories)
.all((req, res) => { res.status(405).send({msg:'Method not allowed'})})

module.exports = categoriesRouter;
