const fs = require('fs');
const util = require('util');
const request = require('request');
const Werror = require('../../util/werror');

const leanPipe = util.promisify(require('../../util/leanpipe'));

const fsOpen = util.promisify(fs.open);
const fsUnlink = util.promisify(fs.unlink);

const getContentLength = (url) => {
  return new Promise((resolve, reject) => {
    request({ url, method: 'HEAD'})
      .on('error', reject)
      .on('response', res => {
        const contentLength = res.headers['content-length'];
        resolve(parseInt(contentLength, 10));
      });
  });
};

/**
 * Downloads the resorce into file. Errors if resorce larger than specified limit.
 * 
 * @param {String} url Resource url
 * @param {String} filePath Destination file path
 * @param {Number} sizeLimit Resource size limiter
 * @param {Boolean} preCheckSize Whether or not to perform a HEAD request 
 * to pre-check the content-lenght header aginst **sizeLimit**
 * 
 * @throws {EEXIST} File already exists
 * @throws {ENOTFOUND} Resorce not found
 * @throws {EMSGSIZE} Size limit exceeded
 */
const download = async (url, filePath, sizeLimit, preCheckSize = true) => {
  try {
    const fileDesc = await fsOpen(filePath, 'wx');
    
    if (preCheckSize) {
      const length = await getContentLength(url);
      if (length > sizeLimit) {
        const error = new Werror('Size limit exeeded', 'EMSGSIZE');
        throw error;
      }
    }
    
    const file$ = fs.createWriteStream('', { fd: fileDesc });
    const req$ = request(url);
    
    await leanPipe(req$, file$, sizeLimit);      
  } catch(err) {
    if (err.code === 'EMSGSIZE') await fsUnlink(filePath)
    throw err;
  };
}

module.exports = { download, getContentLength };


