const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsC");
const { invalidMethodHandler } = require("../error-handlers");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(invalidMethodHandler);

module.exports = topicsRouter;
