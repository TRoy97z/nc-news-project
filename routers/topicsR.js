const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsC");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
