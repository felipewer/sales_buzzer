const fs = require('fs');
const path = require('path');
const util = require('util');
const URL = require('url').URL
const config = require('../../config')
const { download } = require('./downloader');
const player = require('./player');

const fsReaddir = util.promisify(fs.readdir);
const fsUnlink = util.promisify(fs.unlink);
const play = util.promisify(player.play);

exports.list = () => {
  return fsReaddir(config.SOUNDS_FOLDER)
    .then((f) => f.reverse())
}

exports.play = (soundName) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, soundName);
  return play(soundPath);
}

exports.add = async (soundName, url) => {
  const soundUrl = new URL(url);
  const extname = path.extname(soundUrl.pathname).substring(1);
  const soundPath = path.join(config.SOUNDS_FOLDER, `${soundName}.${extname}`);
  const maxSize = 1e+7; // 10 MB
  return download(url, soundPath, maxSize);
}

exports.remove = (soundName) => {
  const soundPath = path.join(config.SOUNDS_FOLDER, soundName);
  return fsUnlink(soundPath);
}
