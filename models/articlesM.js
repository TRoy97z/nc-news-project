const connection = require("../db/connection");
const { IfThingsDontExistHandler } = require("../error-handlers");

exports.selectArticles = query => {
  const sort = query.sort_by || "created_at";
  const order = query.order || "desc";

  if (order != "desc" && order != "asc") {
    return Promise.reject({
      msg: "Bad Request",
      status: 400
    });
  }

  return connection
    .select("articles.*")
    .from("articles")
    .modify(queryBuilder => {
      if (query.author) queryBuilder.where("articles.author", query.author);
      if (query.topic) queryBuilder.where("articles.topic", query.topic);
    })
    .orderBy(sort, order)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(data => {
      let invalid = "";

      if (!data.length) {
        if (query.author) {
          invalid += query.author + " ";
        }
        if (query.topic) {
          invalid += query.topic;
        }
        return Promise.reject({
          msg: "Not Found",
          status: 404
        });
      }
      return data;
    });
};

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .where({ "articles.article_id": article_id })
    .then(article => IfThingsDontExistHandler(article));
};

exports.updateArticleById = (article_id, inc_value) => {
  return connection
    .increment("votes", inc_value)
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(article => IfThingsDontExistHandler(article));
};
