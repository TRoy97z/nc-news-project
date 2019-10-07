const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsR");
const usersRouter = require("../routers/usersR");
const articlesRouter = require("../routers/articlesR");
const commentsRouter = require("../routers/commentsR");
const { invalidMethodHandler } = require("../error-handlers");
const { getApi } = require("../controllers/apiC");

apiRouter
  .route("/")
  .get(getApi)
  .all(invalidMethodHandler);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
module.exports = apiRouter;
