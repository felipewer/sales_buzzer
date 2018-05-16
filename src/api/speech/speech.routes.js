const express = require('express');
const speech = require('./speech.controller');
const { checkSpeech } = require('./speech.validator');
const errorMapper = require('../../util/middleware/validation_error_mapper');

const router = express.Router()

router.post('/speech',
  express.json(),
  [checkSpeech, errorMapper ], 
  speech.speak
);

module.exports = router;
