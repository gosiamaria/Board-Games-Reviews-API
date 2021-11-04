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