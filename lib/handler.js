const uuid = require("uuid");
module.exports = fn => {
  return (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err, req, res) => {
      let errorId = uuid.v4();
      err.message = err.message + ": " + errorId;

      return next(err, req, res, next);
    });
  };
};
