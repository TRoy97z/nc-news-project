const commentsRouter = require("express").Router();

const {
  patchCommentVotes,
  removeCommentById
} = require("../controllers/commentsC");

commentsRouter.patch("/:comment_id", patchCommentVotes);
commentsRouter.delete("/:comment_id", removeCommentById);

module.exports = commentsRouter;
