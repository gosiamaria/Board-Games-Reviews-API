const db = require('../db/index.js');
const { checkIfExists } = require("../utils.js");

exports.deleteCommentById = (comment_id) => {
    return checkIfExists("comments", "comment_id", comment_id).then(() => {
        return db.query(`
        DELETE from comments
        WHERE comment_id = $1
        RETURNING *;
        `, [comment_id])
    })
}

exports.updateComVotes = (comment_id, inc_votes) => {
    if(inc_votes === undefined) {
        return Promise.reject({status: 400, msg: 'Bad request - cannot pass an empty object'})
    };
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