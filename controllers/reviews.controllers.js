const {
  fetchAllReviews,
  fetchReviewsById,
  updateVotes,
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

// exports.updateReview = (req, res, next) => {
//   const { review_id } = req.params;
  
//   const requestedUpdate = req.body;

//   updateReviewById(review_id, requestedUpdate)
//   .then((review) => {
//     res.status(200).send({ review })
//   })
//   .catch(next)
// }

exports.updateReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateVotes(review_id, inc_votes)
  .then((review) => {
    res.status(200).send({ review })
  })
  .catch(next)
}