const commentsRouter = require("express").Router();
const { deleteComment, updateCommentVotes } = require("../controllers/comments.controllers");
const { handleNotAllowedMethods } = require('../controllers/errors.controllers');

commentsRouter.route("/:comment_id")
.delete(deleteComment)
.patch(updateCommentVotes)
.all(handleNotAllowedMethods)

module.exports = commentsRouter;