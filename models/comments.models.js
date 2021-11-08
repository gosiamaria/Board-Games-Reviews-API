const db = require('../db/index.js');
const { checkIfExists } = require("../utils.js");

exports.fetchCommentsByReview = (review_id, limit = 10, p = 1) => {
    if(p < 1) return Promise.reject({status: 400, msg: 'Bad request - invalid page query'})
    if (limit < 1) return Promise.reject({status: 400, msg: "Invalid limit query."});
    if (limit > 10) {
        return Promise.reject({status: 400, msg: "Limit query exceeds maximum of 10."});
    } else {
    const offset = (p - 1) * limit;
    const queryVal = [review_id, limit, offset];

    let queryStr = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
    LEFT JOIN users ON comments.author = users.username
    WHERE comments.review_id = $1 LIMIT $2 OFFSET $3;`;

    const secondQueryStr = `SELECT * FROM reviews WHERE review_id = $1`;

    const promise1 = db.query(queryStr, queryVal);
    const promise2 = db.query(secondQueryStr, [review_id]);

    return Promise.all([promise1, promise2])
    .then(([comments, reviews]) => {

    if (reviews.rows.length === 0) {
        return Promise.reject({status:404, msg:'Review_id does not exist'});
    } 
    if(comments.rows.length === 0) {
        return comments.rows;
    }
        return comments.rows;
    })
    }
    
}

exports.addNewComment = (review_id, postedComment) => {
    return checkIfExists("reviews", "review_id", review_id)
    .then(() => {
        if (Object.keys(postedComment).length < 2) {
        return Promise.reject({ status: 400, msg: "Invalid request body" });
        }
        const validColumns = ["username", "body"];
        for (let i = 0; i < validColumns.length; i++) {
            if (!postedComment.hasOwnProperty(validColumns[i])) {
                return Promise.reject({ status: 400, msg: "Invalid request body" });
            }
        }
    const { username, body } = postedComment;
    return checkIfExists("users", "username", username)
    .then(() => {
        return db.query(`
            INSERT INTO comments (author, review_id, body) 
            VALUES ($1, $2, $3) RETURNING comment_id, votes, created_at, author, body;`, [username, review_id, body])
    })
    .then(({ rows }) => {
        return rows[0]
    })
    })
}

exports.deleteCommentById = (comment_id) => {
    return checkIfExists("comments", "comment_id", comment_id).then(() => {
        return db.query(`
        DELETE from comments
        WHERE comment_id = $1
        RETURNING *;
        `, [comment_id])
    })
}

exports.updateComVotes = (comment_id, inc_votes = 0) => {
    return db
    .query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING*;`, [inc_votes, comment_id])
    .then(({ rows }) => {
    if(rows.length === 0) {
        return Promise.reject({status:404, msg:'Path not found'})
    } else {
        return rows[0]
    }
    })
}