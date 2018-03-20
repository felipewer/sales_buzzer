const path = require('path');

require('dotenv').config();

exports.AUTHORIZED_ORGS = process.env.AUTHORIZED_ORGS
  .split(',').map(o => o.trim());

exports.GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID || ''
exports.GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET || ''
exports.OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || ''

exports.PORT = process.env.PORT || 8080;
exports.SOUNDS_FOLDER = path.join(__dirname, '..', 'sounds');