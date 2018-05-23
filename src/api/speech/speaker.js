const { spawn } = require('child_process');

const speak = (speech, callback) => {
  if (!speech) throw new Error('Missing argument: speech')
  if (!callback) throw new Error('Missing argument: callback function')
  const subProcess = spawn('spd-say', [ speech ]);
  subProcess.on('error', callback);
  subProcess.on('close', code => {
    if (code !== 0) {
      return callback(new Error(`spd-say exited with code ${code}`));
    }
    callback(null);
  });
}

module.exports = { speak };