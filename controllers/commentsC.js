const {
  insertComment,
  selectComment,
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
  let { sortBy, orderBy } = req.query;
  if (orderBy !== "asc" && orderBy !== "desc") orderBy = "desc";
  selectComment(article_id, sortBy, orderBy)
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  let newProp = req.body;
  if (Object.keys(newProp).length === 0) newProp = { key: "value" };
  if (Object.keys(newProp)[0] === "inc_votes") {
    updateCommentVotes(comment_id, newProp)
      .then(([comment]) => {
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
