const crypto = require('crypto');
const util = require('util');
const tokens = require('../../auth/tokens');

const randomBytes = util.promisify(crypto.randomBytes);

exports.create = async () => {
  const bytes = await randomBytes(32);
  const token = bytes.toString('hex');
  await tokens.put(token);
  return token;
}

