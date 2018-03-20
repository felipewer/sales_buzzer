const bodyParser = require('body-parser');
const express = require('express');
const config = require('../../config')
const notFound = require('./not_found')
const sounds = require('./sounds.controller');

const router = express.Router()
const jsonParser = bodyParser.json();

router.get('/sounds', sounds.listSounds);

router.post(`/sounds`, jsonParser, sounds.addSound);  

router.get('/sounds/:soundName',
  notFound(config.SOUNDS_FOLDER), 
  sounds.playSound
);

router.delete('/sounds/:soundName',
  notFound(config.SOUNDS_FOLDER),
  sounds.removeSound
);

module.exports = router;
