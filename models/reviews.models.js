//const { query } = require("../db/index");
const db = require('../db/index.js');

exports.fetchAllReviews = () => {
    console.log('inside model')
    return db
    .query(`SELECT * FROM reviews;`)
    .then(({ rows }) => {
        return rows;
    })
}

exports.fetchReviewsById = (review_id) => {
    console.log('inside model');
    return db
    .query(`
    SELECT reviews.*, count(comments.comment_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
    `, [review_id])
    .then(({ rows }) => {
        return rows[0]
    })
}

// SELECT 
//     reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews
//     LEFT JOIN comments ON reviews.review_id = comments.review_id 
//     WHERE reviews.review_id = $1
//     GROUP BY reviews.review_id;