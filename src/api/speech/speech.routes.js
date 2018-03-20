const bodyParser = require('body-parser');
const express = require('express');
const speech = require('./speech.controller');
const config = require('../../config')

const router = express.Router()
const jsonParser = bodyParser.json();

router.post('/speech', jsonParser, speech.speak);

module.exports = router;
