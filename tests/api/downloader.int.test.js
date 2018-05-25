const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../../src/config');
const { download, getContentLength } = require('../../src/api/sounds/downloader');

const fsStat = util.promisify(fs.stat);
const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

const url = 'https://raw.githubusercontent.com/felipewer/mock-files/master/mock_100_bytes.mp3';

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
  const file1Path = path.join(config.SOUNDS_FOLDER, 'test_download_file1.mp3');
  const file2Path = path.join(config.SOUNDS_FOLDER, 'test_download_file2.mp3');

  test('Should fail', done => {
    download('http://fake.com/file.txt', file1Path, 100)
      .catch(err => {
        expect(err.code).toBe('ENOTFOUND');
        done();
      });
  });

  describe('file exists', () => {

    beforeEach(async () => {
      await fsWriteFile(file1Path, 'fake content');
    });
  
    afterEach(async () => {
      await fsUnlink(file1Path);
    });
  
    test('Filename should already exist', done => {
      download(url, file1Path, 100)
        .catch(err => {
          expect(err.code).toBe('EEXIST');
          done();
        });
    });

  });

  describe('file does not exist', () => {

    afterEach(async () => {
      try {
        await fsUnlink(file2Path);
      } catch (err) { 
        // Ignore!
      }
    });

    test('file should exceed limit', async () => {
      try {
        await download(url, file2Path, 60);
        fail('Should throw EMSGSIZE');
      } catch(err) {
        expect(err.code).toBe('EMSGSIZE');
        expect(await fileExists(file2Path)).toBeFalsy();
      }
    });
    
    test('download should succeed', async () => {
      await download(url, file2Path, 100);
      expect(await fileExists(file2Path)).toBeTruthy();
    });

  });

});
