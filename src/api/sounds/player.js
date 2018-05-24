const { spawn } = require('child_process');
const findExec  = require('find-exec');

const players = [
  'mplayer',
  'afplay',
  'mpg123',
  'mpg321',
  'play',
  'omxplayer',
  'aplay',
  'cmdmp3'
];

const player = findExec(players);
if (!player) throw new Error('No sound player available.');

const play = (soundPath, callback) => {
  if (!soundPath) throw new Error('Missing argument: soundPath')
  if (!callback) throw new Error('Missing argument: callback function')
  const subProcess = spawn(player, [ soundPath ]);
  subProcess.on('error', callback);
  subProcess.on('close', (code) => {
    if (code !== 0) {
      const error = new Error(`${player} exited with code ${code}`);
      error.code = code;
      return callback(error);
    }
    callback(null);
  });
}

module.exports = { play };