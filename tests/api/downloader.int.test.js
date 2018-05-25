const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../../src/config');
const { download, getContentLength } = require('../../src/api/sounds/downloader');

const fsStat = util.promisify(fs.stat);
const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

const url = 'https://raw.githubusercontent.com/felipewer/mock-files/master/mock_100_bytes.mp3';
const urlLarge = 'https://raw.githubusercontent.com/felipewer/mock-files/master/mock_1025_bytes.mp3';

const fileExists = async (path) => {
  try {
    await fsStat(path);
    return true;
  } catch(err){
    return false;
  }
};


describe('getContentLength', () => {

  test('should fail', async () => {
    try {
      await getContentLength('http://fake.com/file.txt');
      fail('Should error whith ENOTFOUND');
    } catch(err) {
      expect(err.code).toBe('ENOTFOUND');
    }
  });

  test('Should be 100 bytes', async () => {
    const length = await getContentLength(url)
    expect(length).toBe(100);
  });

});

describe('download', () => {
  const filePath = path.join(config.SOUNDS_FOLDER, 'test_download_file.mp3');

  test('Should fail', done => {
    download('http://fake.com/file.txt', filePath, 100)
      .catch(err => {
        expect(err.code).toBe('ENOTFOUND');
        done();
      });
  });

  describe('file exists', () => {

    beforeEach(async () => {
      await fsWriteFile(filePath, 'fake content');
    });
  
    afterEach(async () => {
      await fsUnlink(filePath);
    });
  
    test('Filename should already exist', done => {
      download(url, filePath, 100)
        .catch(err => {
          expect(err.code).toBe('EEXIST');
          done();
        });
    });

  });

  describe('file does not exist', () => {

    afterEach(async () => {
      await fsUnlink(filePath);
    });

    test('download should succeed', async () => {
      await download(url, filePath, 100);
      expect(await fileExists(filePath)).toBeTruthy();
    });

  });
  
  describe('Check content size', async () => {
    
    test('file should exceed limit (with precheck)', async () => {
      try {
        await download(url, filePath, 60);
        fail('Should throw EMSGSIZE');
      } catch(err) {
        expect(err.code).toBe('EMSGSIZE');
        expect(await fileExists(filePath)).toBeFalsy();
      }
    });

    test('file should exceed limit (no precheck)', async () => {
      try {
        await download(urlLarge, filePath, 600, false);
        fail('Should throw EMSGSIZE');
      } catch(err) {
        expect(err.code).toBe('EMSGSIZE');
        expect(await fileExists(filePath)).toBeFalsy();
      }
    });

  })

});
