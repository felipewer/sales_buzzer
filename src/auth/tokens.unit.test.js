const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../../src/config');
const tokens = require('./tokens');


const fsWriteFile = util.promisify(fs.writeFile);
const fsReadFile = util.promisify(fs.readFile);
const fsUnlink = util.promisify(fs.unlink);

const emptyTokenPath = path.join(config.TOKENS_FOLDER, 'test_token_empty');  
const ttl500TokenPath = path.join(config.TOKENS_FOLDER, 'test_token_ttl500');  

describe('get', () => {
 
  beforeAll(async () => {
    await fsWriteFile(emptyTokenPath, null);
    await fsWriteFile(ttl500TokenPath, 500);
  })
  afterAll(async () => {
    await fsUnlink(emptyTokenPath);
    await fsUnlink(ttl500TokenPath);
  });

  test('should have infinite ttl', async () => {
    const ttl = await tokens.get('test_token_empty');
    expect(ttl).toBe(Infinity);
  });

  test('should have ttl of 500', async () => {
    const ttl = await tokens.get('test_token_ttl500');
    expect(ttl).toBe(500);
  });

  test('token should not exist', async () => {
    try {
      await tokens.get('nonexistent_token');
      fail('Should throw ENOENT');
    } catch(err) {
      expect(err.code).toBe('ENOENT');
    }
  });

});

describe('put', () => {
 
  afterAll(async () => {
    await fsUnlink(emptyTokenPath);
    await fsUnlink(ttl500TokenPath);
  });

  test('should put empty token', async () => {
    await tokens.put('test_token_empty');
    const content = await fsReadFile(emptyTokenPath);
    expect(parseInt(content, 10)).toBe(NaN);
  });

  test('should token with ttl of 500', async () => {
    await tokens.put('test_token_ttl500', 500);
    const content = await fsReadFile(ttl500TokenPath);
    expect(parseInt(content, 10)).toBe(500);
  });

});