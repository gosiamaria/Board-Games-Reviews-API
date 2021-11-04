const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router.js");
const reviewsRouter = require("./reviews.router");
const commentsRouter = require("./comments.router")

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;