const Werror = require('./werror');

module.exports = (read$, write$, sizeLimit, callback) => {
    let currentSize = 0;
    read$.on('data', chunk => {
      if (!chunk) return read$.emit('complete');
      
      currentSize += chunk.length;
      if (currentSize > sizeLimit) {
        const error = new Werror('Size limit exeeded', 'EMSGSIZE');
        read$.emit('error', error);
      } 
    }).on('error', err => {
      read$.abort();
      write$.close();
      callback(err);
    }).on('complete', () => callback())
    .pipe(write$);
}