const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById
} = require("../controllers/articlesC");
const {
  postCommentByArticleId,
  getCommentByArticleId
} = require("../controllers/commentsC");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
