const fs = require('fs');
const util = require('util');
const request = require('request');

const leanPipe = util.promisify(require('../../util/leanpipe'));

const fsOpen = util.promisify(fs.open);
const fsUnlink = util.promisify(fs.unlink);

const getContentLength = (url, callback) => {
  request({ url, method: 'HEAD'})
    .on('error', callback)
    .on('response', res => {
      const contentLength = res.headers['content-length'];
      callback(null, parseInt(contentLength, 10));
    });
};

exports.getContentLength = util.promisify(getContentLength);

exports.download = async (url, filePath, sizeLimit) => {
  try {
    const fd = await fsOpen(filePath, 'wx');
    const file$ = fs.createWriteStream('', { fd });
    const req$ = request(url);
    await leanPipe(req$, file$, sizeLimit);      
  } catch(err) {
    if (err.code === 'EMSGSIZE') await fsUnlink(filePath)
    throw err;
  };
}



