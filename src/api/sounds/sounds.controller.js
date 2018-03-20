const fs = require('fs');
const path = require('path');
const player = require('play-sound')(opts = {});
const request = require('request');
const { Observable } = require('rxjs/Rx');
const config = require('../../config')
const { onFsError } = require('../../util');

const fsOpen = Observable.bindNodeCallback(fs.open);
const fsReaddir = Observable.bindNodeCallback(fs.readdir);
const fsUnlink = Observable.bindNodeCallback(fs.unlink);

exports.listSounds = (req, res) => {
  fsReaddir(config.SOUNDS_FOLDER).subscribe(
    files => res.status(200).json(files),
    onFsError(res)
  );
}

exports.addSound = (req, res) => {
  const {sound, url} = req.body
  const soundPath = path.join(config.SOUNDS_FOLDER, sound)
  fsOpen(soundPath, 'wx')
    .subscribe(
      fd => {
        request(url)
          .on('error', err => res.status(400).send())
          .on('response', resp => res.status(201).send())  
          .pipe(fs.createWriteStream('', { fd }))
      },  
      onFsError(res)
    );  
}

exports.playSound = (req, res) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, req.params.soundName)
  player.play(soundPath, (err) => {
    if(err) {
      console.error(err);
      res.status(500).send();
    }else{
      res.status(200).send();
    }
  });
}

exports.removeSound = (req, res) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, req.params.soundName)
  fsUnlink(soundPath).subscribe(
    () => res.status(200).send(),
    onFsError(res)
  )
}