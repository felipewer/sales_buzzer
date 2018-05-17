const { check } = require('express-validator/check');

const checkSpeech =
  check('speech', 'Should contain up to 140 word characters')
    .exists()
    .isLength({ min: 1, max: 140 })
    .matches(/^(\w+? *?)+$/)

module.exports = { checkSpeech }

