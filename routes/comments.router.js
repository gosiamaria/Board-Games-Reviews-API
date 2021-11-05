const commentsRouter = require("express").Router();
const { deleteComment, updateCommentVotes } = require("../controllers/comments.controllers");

commentsRouter.route("/:comment_id")
.delete(deleteComment)
.patch(updateCommentVotes)
.all((req, res) => { res.status(405).send({msg:'Method not allowed'})})

module.exports = commentsRouter;