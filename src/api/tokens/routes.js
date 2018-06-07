const boom = require('boom');
const express = require('express');
const { create } = require('./controller');

const router = express.Router()

router.post('/tokens',
  (req, res, next) => {
    create()
      .then(token => res.send(token))
      .catch((err) => next(boom.internal(err)));
  }
);

module.exports = router;
