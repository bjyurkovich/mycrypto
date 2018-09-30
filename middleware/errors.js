// @flow

const __PROD__ = process.env.NODE_ENV === "production";

module.exports = function error(err, req, res, next) {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: __PROD__ ? "Something went wrong." : err.message,
    stack: __PROD__ ? undefined : err.stack
  });
};
