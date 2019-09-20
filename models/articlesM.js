const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .where({ "articles.article_id": article_id });
};

exports.updateArticleById = (article_id, inc_value) => {
  return connection
    .increment("votes", inc_value)
    .from("articles")
    .where({ article_id })
    .returning("*");
};
