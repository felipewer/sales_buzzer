const boom = require('boom');
const express = require('express');
const { speak } = require('./controller');
const { checkSpeech } = require('./validator');
const errorMapper = require('../../util/middleware/validation_error_mapper');

const router = express.Router()

router.post('/speech',
  express.json(),
  [ checkSpeech ],
  errorMapper,
  (req, res, next) => {
    speak(req.body.speech)
      .then(() => res.send())
      .catch((err) => next(boom.internal(err)));
  }
  // async (req, res, next) => {
  //   try {
  //     await speak(req.body.speech);
  //     res.send();
  //   } catch(error) {
  //     next(boom.badImplementation(error))
  //   }
  // }
);

module.exports = router;
