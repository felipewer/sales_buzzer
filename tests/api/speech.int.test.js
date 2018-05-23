const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('supertest');
const app = require('../../src/app')
const { initDB } = require('../../src/setup');
const config = require('../../src/config');

const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

jest.mock('../../src/api/speech/speaker');
const { speak } = require('../../src/api/speech/speaker');
speak.mockImplementation((speech, cb) => cb(null));

describe('speech route', () => {
  const authTokenPath = path.join(config.TOKENS_FOLDER, 'test_token');

  beforeAll(async () => {
    initDB();
    await fsWriteFile(authTokenPath, '');
  });

  afterAll(async () => {
    await fsUnlink(authTokenPath);
  });

  describe('usher speech', () => {

    test('It should not be authorized', async () => {
      const res = await request(app).post('/api/speech');
      expect(res.statusCode).toBe(401);
    });
  
    test('It should not pass validation', async () => {
      const res = await request(app)
        .post('/api/speech')
        .send({})
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(422);
    });
  
    test('It should usher speech', async () => {
      const res = await request(app)
        .post('/api/speech')
        .send({ speech: 'some speech' })
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('');
    });

  });

});