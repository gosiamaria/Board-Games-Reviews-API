const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router.js");
const reviewsRouter = require("./reviews.router");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter)

module.exports = apiRouter;