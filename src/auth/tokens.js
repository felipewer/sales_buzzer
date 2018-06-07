const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../config');

const fsWriteFile = util.promisify(fs.writeFile);
const fsReadFile = util.promisify(fs.readFile);

exports.get = async (token) => {
  const tokenPath = path.join(config.TOKENS_FOLDER, token);
  const content = await fsReadFile(tokenPath);
  const ttl = parseInt(content, 10);
  return !ttl ? Infinity : ttl;
}

exports.put = (token, ttl = '') => {
  const tokenPath = path.join(config.TOKENS_FOLDER, token);
  return fsWriteFile(tokenPath, ttl);
}
