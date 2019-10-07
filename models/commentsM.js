const connection = require("../db/connection");

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return connection
    .insert({ author: username, body, article_id })
    .into("comments")
    .returning("*");
};

exports.selectComment = (
  article_id,
  sort_by = "created_at",
  orderBy = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .orderBy(sort_by, orderBy)
    .where({ article_id });
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
