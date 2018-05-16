const { check } = require('express-validator/check');

const checkSpeech = check('speech')
  .exists()
  .isLength({ min: 1, max: 140 })
  .matches(/(\w+? *?)+$/)
  .withMessage('Speech should contain only word characters');

module.exports = { checkSpeech }

