const {
  fetchAllReviews,
  fetchReviewsById
} = require('../models/reviews.models.js');

exports.getAllReviews = (req, res, next) => {
  console.log('inside controller');
  fetchAllReviews()
  .then((reviews) => {
    res.status(200).send({ reviews })
  })
  .catch(next)
}

exports.getReviewsById = (req, res, next) => {
  console.log('inside controller');
  const { review_id } = req.params;

  fetchReviewsById(review_id)
  .then((review) => {
    res.status(200).send({ review })
  })
  .catch(next)
}