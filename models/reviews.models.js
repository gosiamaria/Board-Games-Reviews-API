const db = require('../db/index.js');

exports.fetchAllReviews = () => {
  return db
  .query(`SELECT * FROM reviews;`)
  .then(({ rows }) => {
    return rows;
  })
}

exports.fetchReviewsById = (review_id) => {
  return db
  .query(`
  SELECT reviews.*, COUNT(comments.comment_id) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id 
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `, [review_id])
  .then(({ rows }) => {
    if(rows.length === 0) {
      return Promise.reject({status:404, msg:'Review not found'})
    } else {
      return rows[0]
    }
  })
}
