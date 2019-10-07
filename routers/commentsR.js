const commentsRouter = require("express").Router();

const {
  patchCommentVotesById,
  removeCommentById
} = require("../controllers/commentsC");

const { invalidMethodHandler } = require("../error-handlers");

commentsRouter
  .patch("/:comment_id", patchCommentVotesById)
  .all(invalidMethodHandler);
commentsRouter
  .delete("/:comment_id", removeCommentById)
  .all(invalidMethodHandler);

module.exports = commentsRouter;
