const commentsRouter = require("express").Router();

const {
  patchCommentVotes,
  removeCommentById
} = require("../controllers/commentsC");

const { invalidMethodHandler } = require("../error-handlers");

commentsRouter
  .patch("/:comment_id", patchCommentVotes)
  .all(invalidMethodHandler);
commentsRouter
  .delete("/:comment_id", removeCommentById)
  .all(invalidMethodHandler);

module.exports = commentsRouter;
