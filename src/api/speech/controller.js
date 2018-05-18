const util = require('util');
const speaker = require('./speaker');

exports.speak = util.promisify(speaker.speak);