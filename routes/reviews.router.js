const reviewsRouter = require("express").Router();
const { getAllReviews, getReviewsById } = require("../controllers/reviews.controllers");

reviewsRouter.route("/")
.get(getAllReviews)

reviewsRouter.route("/:review_id")
.get(getReviewsById)



module.exports = reviewsRouter;
