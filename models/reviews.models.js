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

// exports.updateReviewById = (review_id, requestedUpdate) => {
//   let requestKey = '';
//   for(property in requestedUpdate) {
//     request += property;
//   }

//   let requestVal = '';
//   for(property in requestedUpdate) {
//     requestVal += requestedUpdate[property];
//   }

//   const updateBank = ['title', 'review_img_url', 'review_body', 'votes'];

//   if(!updateBank.includes(requestKey)) {
//     return Promise.reject({status:400, msg:'Invalid request'})
//   }
//   return db
//   .query(`
//   UPDATE reviews
//   SET $1 = $2
//   WHERE review_id = $3 RETURNING*;
//   `, [requestKey, requestVal, review_id])
//   .then(({ rows }) => {
//     return rows[0];
//   })
// }

exports.updateVotes = (review_id, inc_votes) => {
  return db
  .query(`
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING*;`, [inc_votes, review_id])
  .then(({ rows }) => {
    return rows[0]
  })
}