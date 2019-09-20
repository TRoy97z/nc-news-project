const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsR");
const usersRouter = require("../routers/usersR");
const articlesRouter = require("../routers/articlesR");
const commentsRouter = require("../routers/commentsR");
const { invalidMethodHandler } = require("../error-handlers");

apiRouter
  .get("/", (req, res) => {
    res.send("Nothing to see here....yet");
  })
  .all(invalidMethodHandler);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
module.exports = apiRouter;
