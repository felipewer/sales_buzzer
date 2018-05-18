const express = require('express');
const config = require('../../config');
const notFound = require('./not_found');
const sounds = require('./controller');
const errorMapper = require('../../util/middleware/validation_error_mapper');
const {
  checkFileName,
  checkName,
  checkUrl
} = require('./validator');

const router = express.Router()

router.get('/sounds', sounds.listSounds);

router.post(`/sounds`,
  express.json(),
  [ checkName, checkUrl, errorMapper ],
  sounds.addSound
);  

router.get('/sounds/:soundName',
  [checkFileName, errorMapper ], 
  notFound(config.SOUNDS_FOLDER), 
  sounds.playSound
);

router.delete('/sounds/:soundName',
  [checkFileName, errorMapper ], 
  notFound(config.SOUNDS_FOLDER),
  sounds.removeSound
);

module.exports = router;
