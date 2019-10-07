const {
  insertComment,
  selectComments,
  updateCommentVotes,
  deleteComment
} = require("../models/commentsM");

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
  let { sort_by, order } = req.query;
  if (order !== "asc" && order !== "desc") order = "desc";
  selectComments(article_id, sort_by, order)
    .then(([comments]) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  let newProp = req.body;
  if (Object.keys(newProp).length === 0) newProp = { key: "value" };
  updateCommentVotes(comment_id, newProp)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
