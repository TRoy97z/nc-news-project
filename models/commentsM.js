const connection = require("../db/connection");

exports.insertComment = (article_id, newComment) => {
  const { username, body, created_at } = newComment;
  return connection
    .insert({ author: username, body, article_id, created_at })
    .into("comments")
    .returning("*");
};

exports.selectComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .orderBy(sort_by, order)
    .where({ article_id })
    .then(comments => {
      if (comments.length) return Promise.all([comments]);
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    });
};

exports.updateCommentVotes = (comment_id, { inc_votes = 0 }) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (comment.length) return comment;
      else return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};

exports.deleteComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};
