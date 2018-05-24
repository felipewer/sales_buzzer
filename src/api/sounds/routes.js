const boom = require('boom');
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

router.get('/sounds', async (req, res, next) => {
  try {
    const soundList = await sounds.list();
    res.json(soundList);
  } catch(err) {
    next(boom.internal(err));
  }
});

router.post(`/sounds`,
  express.json(),
  [ checkName, checkUrl, errorMapper ],
  sounds.addSound
);

router.get('/sounds/:soundName',
  [checkFileName, errorMapper ], 
  // notFound(config.SOUNDS_FOLDER), 
  async (req, res, next) => {
    try {
      await sounds.play(req.params.soundName);
      res.send();
    } catch(err) {
      if(err.code === 2) return next(boom.notFound(err));
      next(boom.internal(err));
    }
  }
);

// router.get('/sounds/:soundName',
//   [checkFileName, errorMapper ], 
//   sounds.playSound
// );

router.delete('/sounds/:soundName',
  [checkFileName, errorMapper ], 
  notFound(config.SOUNDS_FOLDER),
  sounds.removeSound
);

module.exports = router;
