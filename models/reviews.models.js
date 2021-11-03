const db = require('../db/index.js');

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

exports.updateVotes = (review_id, inc_votes) => {
  if(inc_votes === undefined) {
    return Promise.reject({status: 400, msg: 'Bad request'})
  };
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

exports.fetchAllReviews = (sort_by = 'created_at', order = 'desc', category) => {
  const sortColumns = ['votes', 'created_at', 'title', 'designer', 'owner', 'category'];
	const orderWays = ['ASC', 'DESC', 'asc', 'desc'];

  if(!sortColumns.includes(sort_by)) {
    return Promise.reject({status:400, msg: 'Invalid sort_by query input'})
  } 

  if(!orderWays.includes(order)) {
    return Promise.reject({status:400, msg: 'Invalid order query input'})
  } else {

    let queryStr = `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.votes, reviews.category, reviews.review_img_url, reviews.created_at, COUNT(comments.comment_id)::INT AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  
    const queryVal = [];
  
    if(category) {
      queryVal.push(category);
      queryStr += ` WHERE reviews.category = $1`;
    }
  
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`

    return db
    .query(queryStr, queryVal)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No items found" });
      }
      return rows;
    })
  }
}

exports.fetchCommentsByReview = (review_id) => {
  const queryStr = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
  LEFT JOIN users ON comments.author = users.username
  WHERE comments.review_id = $1;`;

  const secondQueryStr = `SELECT * FROM reviews WHERE review_id = $1`;

  const promise1 = db.query(queryStr, [review_id]);
  const promise2 = db.query(secondQueryStr, [review_id]);

  return Promise.all([promise1, promise2])
  .then(([comments, reviews]) => {

    if(comments.rows.length === 0) {
      if (reviews.rows.length === 0) {
        return Promise.reject({status:404, msg:'Review_id does not exist'});
      } 
      return comments.rows;
    }
    return comments.rows;
  })
}

exports.addNewComment = (review_id, username, body) => {
  return db
  .query(`INSERT INTO comments (author, review_id, body) 
    VALUES ($1, $2, $3) RETURNING *;`, [username, review_id, body])
  .then(({ rows }) => {
    console.log(rows);
    if(rows.length === 0) {
      return Promise.reject({status:404, msg: 'Path not found'})
    }
    return rows[0]
  })
}
