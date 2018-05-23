const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('supertest');
const app = require('../../src/app')
const { initDB } = require('../../src/setup');
const config = require('../../src/config');

const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

jest.mock('play-sound');
const { play } = require('play-sound');
play.mockImplementation((speech, cb) => cb(null));

describe('sounds route', () => {
  const authTokenPath = path.join(config.TOKENS_FOLDER, 'test_token');

  beforeAll(async () => {
    initDB();
    await fsWriteFile(authTokenPath, '');
  });

  afterAll(async () => {
    await fsUnlink(authTokenPath);
  });

});