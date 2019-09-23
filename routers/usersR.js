const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersC");
const { invalidMethodHandler } = require("../error-handlers");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethodHandler);
module.exports = usersRouter;
