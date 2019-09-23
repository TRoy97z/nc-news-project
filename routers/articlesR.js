const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles
} = require("../controllers/articlesC");
const {
  postCommentByArticleId,
  getCommentByArticleId
} = require("../controllers/commentsC");
const { invalidMethodHandler } = require("../error-handlers");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentByArticleId)
  .post(postCommentByArticleId)
  .all(invalidMethodHandler);

module.exports = articlesRouter;
