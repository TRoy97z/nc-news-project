exports.customErrorHandler = (err, req, res, next) => {
  // console.log(err);
  if (err.status) {
    res.status(err.status).send(err);
  } else next(err);
};

exports.sqlErrorHandler = (err, req, res, next) => {
  // console.log(err);
  const errorCode = ["42703", "23502", "22P02"];
  if (errorCode.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (["23503"].includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else next(err);
};

exports.invalidMethodHandler = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.internalServerErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};

exports.IfThingsDontExistHandler = array => {
  if (array.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Input Does Not Exist"
    });
  } else return array;
};
