const fs = require('fs');
const path = require('path');
const { Observable } = require('rxjs/Rx');
const onFsError = require('./fs_error');

const fsAccess = Observable.bindNodeCallback(fs.access);

const notFound = (basePath) => (req, res, next) => {
  const soundPath = path.join(basePath, req.params.soundName);
  fsAccess(soundPath).subscribe(() => next(), onFsError(res));
}

module.exports = notFound;