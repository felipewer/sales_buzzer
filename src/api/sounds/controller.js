const fs = require('fs');
const path = require('path');
const URL = require('url').URL;
const util = require('util');
const player = require('./player');
const request = require('request');
const { Observable } = require('rxjs/Rx');
const config = require('../../config')
const { fsErrorHandler } = require('../../util/fs_error_handler');

const fsOpen = Observable.bindNodeCallback(fs.open);
const fsUnlink = Observable.bindNodeCallback(fs.unlink);

const fsReaddir = util.promisify(fs.readdir);
const play = util.promisify(player.play);

exports.list = () => {
  return fsReaddir(config.SOUNDS_FOLDER)
    .then((f) => f.reverse())
}

exports.play = (soundName) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, soundName)
  return play(soundPath);
}

exports.addSound = (req, res) => {
  const {soundName, url} = req.body
  const soundUrl = new URL(url);
  const extname = path.extname(soundUrl.pathname).substring(1);
  const soundPath = path.join(config.SOUNDS_FOLDER, `${soundName}.${extname}`);
  // TODO - remove file on request error
  fsOpen(soundPath, 'wx')
    .subscribe(
      fd => {
        request(url)
          .on('error', err => res.status(400).send())
          .on('response', resp => res.status(201).send())  
          .pipe(fs.createWriteStream('', { fd }))
      },  
      fsErrorHandler(res)
    );  
}


exports.removeSound = (req, res) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, req.params.soundName)
  fsUnlink(soundPath).subscribe(
    () => res.status(200).send(),
    fsErrorHandler(res)
  )
}