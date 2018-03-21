const path = require('path');

require('dotenv').config();

const getEnv = (variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
  return process.env[variable];
}

exports.APP_NAME = getEnv('APP_NAME');
exports.AUTHORIZED_ORGS = getEnv('AUTHORIZED_ORGS')
  .split(',').map(o => o.trim());

exports.GITHUB_OAUTH_CLIENT_ID = getEnv('GITHUB_OAUTH_CLIENT_ID');
exports.GITHUB_OAUTH_CLIENT_SECRET = getEnv('GITHUB_OAUTH_CLIENT_SECRET');
exports.OAUTH_CALLBACK_URL = getEnv('OAUTH_CALLBACK_URL');
exports.OAUTH_TOKEN_MAX_AGE = getEnv('OAUTH_TOKEN_MAX_AGE');

exports.PORT = getEnv('PORT');
exports.DB_FOLDER = path.join(__dirname, '..', 'db');
exports.SOUNDS_FOLDER = path.join(exports.DB_FOLDER, 'sounds');
exports.TOKENS_FOLDER = path.join(exports.DB_FOLDER, 'tokens');