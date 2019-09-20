const { insertComment, selectComment } = require("../models/commentsM");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(article_id, newComment)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  let { sortBy, orderBy } = req.query;
  if (orderBy !== "asc" && orderBy !== "desc") orderBy = "desc";
  selectComment(article_id, sortBy, orderBy)
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};
