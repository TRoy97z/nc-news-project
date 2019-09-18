const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsR");

apiRouter.get("/", (req, res) => {
  res.send("Nothing to see here....yet");
});

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
