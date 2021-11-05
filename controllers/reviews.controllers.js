const {
  fetchReviewsById,
  updateVotes,
  fetchAllReviews
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

  const { sort_by, order, category, limit, p } = req.query;

  fetchAllReviews(sort_by, order, category, limit, p)
  .then((reviews) => {
    res.status(200).send({ reviews })
  })
  .catch(next)
}

