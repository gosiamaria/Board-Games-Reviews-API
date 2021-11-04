const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router.js");
const reviewsRouter = require("./reviews.router");
const commentsRouter = require("./comments.router")
const { getEndpoints } = require("../controllers/api.controllers.js")

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;