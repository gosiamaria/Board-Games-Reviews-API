const { fetchCommentsByReview, addNewComment, deleteCommentById, updateComVotes } = require("../models/comments.models.js")

exports.getCommentsByReview = (req, res, next) => {
    const { review_id } = req.params;
    fetchCommentsByReview(review_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.addCommentByReview = (req, res, next) => {
    const { review_id } = req.params;
    const postedComment = req.body;
    addNewComment(review_id, postedComment)
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch(next)
}

exports.updateCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateComVotes(comment_id, inc_votes)
    .then((comment) => {
        res.status(200).send({ comment })
    })
    .catch(next)
}
