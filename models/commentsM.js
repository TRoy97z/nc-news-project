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
  sortBy = "created_at",
  orderBy = "desc"
) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .orderBy(sortBy, orderBy)
    .where({ article_id });
};
