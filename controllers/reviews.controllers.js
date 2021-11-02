const {
  fetchAllReviews,
  fetchReviewsById
} = require('../models/reviews.models.js');

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews()
  .then((reviews) => {
    res.status(200).send({ reviews })
  })
  .catch(next)
}

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewsById(review_id)
  .then((review) => {
    res.status(200).send({ review })
  })
  .catch(next)
}