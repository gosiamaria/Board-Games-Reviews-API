const db = require('../db/index.js');
const { checkIfExists } = require("../utils.js")

exports.fetchReviewsById = (review_id) => {
  return db
  .query(`
  SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id 
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `, [review_id])
  .then(({ rows }) => {
    if(rows.length === 0) {
      return Promise.reject({status:404, msg:'Path not found'})
    } else {
      return rows[0]
    }
  })
}

exports.updateVotes = (review_id, inc_votes = 0) => {
  return db
  .query(`
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING*;`, [inc_votes, review_id])
  .then(({ rows }) => {
    if(rows.length === 0) {
      return Promise.reject({status:404, msg:'Path not found'})
    } else {
      return rows[0]
    }
  })
}

exports.fetchAllReviews = (sort_by = 'created_at', order = 'desc', category, limit = 10, p = 1) => {
  if(p < 1) {
    return Promise.reject({status: 400, msg: 'Bad request - invalid page query'})
  }
  if (limit < 1) return Promise.reject({status: 400, msg: "Invalid limit query."});
  if(!['votes', 'created_at', 'title', 'designer', 'owner', 'category'].includes(sort_by)) {
    return Promise.reject({status:400, msg: 'Invalid sort_by query input'})
  } 
  if(!['ASC', 'DESC', 'asc', 'desc'].includes(order)) {
    return Promise.reject({status:400, msg: 'Invalid order query input'})
  } else {
    const offset = (p - 1) * limit;

    const queryVal = [limit, offset];
    
    let queryStr = `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.votes, reviews.category, reviews.review_img_url, reviews.created_at, reviews.review_body, COUNT(comments.comment_id)::INT AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  
    if(category) {
      queryVal.push(category);
      queryStr += ` WHERE reviews.category = $3`;
    }
  
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2;`

    return db
    .query(queryStr, queryVal)
    .then(({ rows }) => {
      if (rows.length === 0) {
        if(category) {
          return checkIfExists('categories', 'slug', category).then(() => {
            return rows;
          })
        } else {
          return Promise.reject({status:404, msg: `Page not found.`})
        }
      }
      return rows;
    })
  }
}

