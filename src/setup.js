const fs = require('fs');
const config = require('./config');

const initDB = () => {
  if (!fs.existsSync(config.DB_FOLDER)) {
    fs.mkdirSync(config.DB_FOLDER);
    fs.mkdirSync(config.SOUNDS_FOLDER);
    fs.mkdirSync(config.TOKENS_FOLDER);
  }
}

module.exports = { initDB };