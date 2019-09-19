const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersC");

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
