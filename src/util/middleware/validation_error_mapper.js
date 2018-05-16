const boom = require('boom');
const { validationResult } = require('express-validator/check');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array()
      .map(e => `(${e.param}): ${e.msg}`)
      .join(' | ');
    return next(boom.badData(err));
  }
  next();
};
