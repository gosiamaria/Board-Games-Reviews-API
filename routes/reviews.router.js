const reviewsRouter = require("express").Router();
const { getAllReviews, getReviewsById, updateReviewVotes } = require("../controllers/reviews.controllers");

reviewsRouter.route("/")
.get(getAllReviews)

reviewsRouter.route("/:review_id")
.get(getReviewsById)
.patch(updateReviewVotes)

module.exports = reviewsRouter;
