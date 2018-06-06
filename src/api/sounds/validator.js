const path = require('path');
const URL = require('url').URL;
const { check } = require('express-validator/check');

const checkName =
  check('soundName', 'Should contain up to 50 word characters')
    .exists()
    .isLength({ min: 1, max: 50 })
    .matches(/^\w+?$/);

const checkUrl =
  check('url', 'Supported file extensions are wav and mp3')
    .exists()
    .isURL()
    .matches(/^.*?\/.+?\.(wav|mp3)$/);

checkFileName =
  check('soundName', 'Invalid identifier')
    .exists()
    .isLength({ min: 1, max: 54 })
    .matches(/^\w+?\.(wav|mp3)$/);

module.exports = {
  checkFileName,
  checkName,
  checkUrl
};

