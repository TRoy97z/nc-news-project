const {
  selectArticleById,
  updateArticleById,
  selectArticles
} = require("../models/articlesM");

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      return res.status(200).send({ article });
    })
    .catch(next);
};
