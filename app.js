const express = require("express");
const app = express();
const apiRouter = require("./routers/api");
const {
  sqlErrorHandler,
  internalServerErrorHandler,
  customErrorHandler,
  invalidMethodHandler
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send("Path Not Found");
});

app.use(customErrorHandler);
app.use(sqlErrorHandler);
app.use(invalidMethodHandler);
app.use(internalServerErrorHandler);

module.exports = app;
