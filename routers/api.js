const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsR");
const usersRouter = require("../routers/usersR");

apiRouter.get("/", (req, res) => {
  res.send("Nothing to see here....yet");
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
