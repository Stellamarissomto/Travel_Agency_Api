const mongoose = require("mongoose");
const AppError = require("../util/appError");

// handles castErrors
const castErrors = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// handles duplicate field

const handleDuplicate = (err) => {
  const message = `Duplicate field value. Please use another value!`;
  return new AppError(message, 400);
};
// handles errors sent in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// handles error sent on production mode
const sendErrorPro = (err, res) => {
  // operational errors, trusted . send to the client.
  // operational error are error caused by operation like wrong Id or input
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR ", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log("err: ", err);
    let error = { ...err };
    console.log("error: ", error);

    if (error.name === "CastError") error = castErrors(error);
    if (error.code === 11000) error = handleDuplicate(error);
    sendErrorPro(error, res);
  }
};
