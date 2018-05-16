const fs = require('fs');
const path = require('path');
const { Observable } = require('rxjs/Rx');
const { fsErrorHandler } = require('../../util/fs_error_handler');

const fsAccess = Observable.bindNodeCallback(fs.access);

const notFound = (basePath) => (req, res, next) => {
  const soundPath = path.join(basePath, req.params.soundName);
  fsAccess(soundPath).subscribe(() => next(), fsErrorHandler(res));
}

module.exports = notFound;