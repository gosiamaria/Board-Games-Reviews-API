const reviewsRouter = require("express").Router();
const { getAllReviews, getReviewsById, updateReviewVotes } = require("../controllers/reviews.controllers");
const { getCommentsByReview, addCommentByReview } = require("../controllers/comments.controllers.js");
const { handleNotAllowedMethods } = require('../controllers/errors.controllers');

reviewsRouter.route("/")
.get(getAllReviews)
.all(handleNotAllowedMethods)

reviewsRouter.route("/:review_id")
.get(getReviewsById)
.patch(updateReviewVotes)
.all(handleNotAllowedMethods)

reviewsRouter.route("/:review_id/comments")
.get(getCommentsByReview)
.post(addCommentByReview)
.all(handleNotAllowedMethods)

module.exports = reviewsRouter;

