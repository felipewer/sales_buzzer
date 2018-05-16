const path = require('path');
const URL = require('url').URL;
const { check } = require('express-validator/check');


const checkName = check('soundName')
  .exists()
  .isLength({ min: 1, max: 50 })
  .matches(/^\w+?$/)
  .withMessage('Name should contain only word characters');

const checkUrl = check('url')
  .exists()
  .isURL()
  .matches(/^.*?\/\w+?\.(wav|mp3)$/)
  .withMessage('Supported file extensions are wav and mp3');

checkFileName = check('soundName')
  .exists()
  .isLength({ min: 1, max: 54 })
  .matches(/^\w+?\.(wav|mp3)$/)
  .withMessage('Invalid identifier format');

module.exports = {
  checkFileName,
  checkName,
  checkUrl
};

