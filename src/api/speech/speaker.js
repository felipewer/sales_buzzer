const { spawn } = require('child_process');

const speak = (speech, callback) => {
  if (!speech) throw new Error('Missing argument: speech')
  if (!callback) throw new Error('Missing argument: callback function')
  const process = spawn('spd-say', [ speech ]);
  process.on('error', callback);
  process.on('close', (code) => {
    const error = code && !code.killed ? code : null;
    callback(error)
  });
}

module.exports = { speak };