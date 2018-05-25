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
  async (req, res, next) => {
    try {
      await sounds.add(req.body.soundName, req.body.url);
      res.status(201).send();
    } catch(err) {
      switch (err.code) {
        case 'EEXIST': return next(boom.conflict(err));
        case 'ENOTFOUND': return next(boom.badData(err));
        case 'EMSGSIZE': return next(boom.badData(err));
        default: next(boom.internal(err));
      }
    }
  }
);


router.get('/sounds/:soundName',
  [checkFileName, errorMapper ], 
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

router.delete('/sounds/:soundName',
  [checkFileName, errorMapper ], 
  async (req, res, next) => {
    try {
      await sounds.remove(req.params.soundName);
      res.send();
    } catch(err) {
      if(err.code === 'ENOENT') return next(boom.notFound(err));
      next(boom.internal(err));
    }
  }
);

module.exports = router;
