const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articlesC");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

module.exports = articlesRouter;
