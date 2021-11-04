const {
  fetchReviewsById,
  updateVotes,
  fetchAllReviews,
  fetchCommentsByReview,
  addNewComment,
} = require('../models/reviews.models.js');

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewsById(review_id)
  .then((review) => {
    res.status(200).send({ review })
  })
  .catch(next)
}

exports.updateReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateVotes(review_id, inc_votes)
  .then((review) => {
    res.status(200).send({ review })
  })
  .catch(next)
}

exports.getAllReviews = (req, res, next) => {

  const { sort_by, order, category } = req.query;

  fetchAllReviews(sort_by, order, category)
  .then((reviews) => {
    res.status(200).send({ reviews })
  })
  .catch(next)
}

exports.getCommentsByReview = (req, res, next) => {

  const { review_id } = req.params;

  fetchCommentsByReview(review_id)
  .then((comments) => {
    res.status(200).send({ comments })
  })
  .catch(next)
}

exports.addCommentByReview = (req, res, next) => {
  const { review_id } = req.params;
  const postedComment = req.body;

  addNewComment(review_id, postedComment)
  .then((newComment) => {
    res.status(201).send({ newComment })
  })
  .catch(next)
}