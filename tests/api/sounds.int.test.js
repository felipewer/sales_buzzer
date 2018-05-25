const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('supertest');
const app = require('../../src/app')
const { initDB } = require('../../src/setup');
const config = require('../../src/config');

const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

jest.mock('../../src/api/sounds/player');

describe('sounds route', () => {
  const authTokenPath = path.join(config.TOKENS_FOLDER, 'test_token');

  beforeAll(async () => {
    initDB();
    await fsWriteFile(authTokenPath, '');
  });

  afterAll(async () => {
    await fsUnlink(authTokenPath);
  });

  describe('list sounds', () => {
    const file1Path = path.join(config.SOUNDS_FOLDER, 'test_sounds_file1.mp3');
    const file2Path = path.join(config.SOUNDS_FOLDER, 'test_sounds_file2.mp3');

    beforeAll(async () => {
      await fsWriteFile(file1Path, 'fake content');
      await fsWriteFile(file2Path, 'fake content');
    });

    afterAll(async () => {
      await fsUnlink(file1Path);
      await fsUnlink(file2Path);
    });
  
    test('It should not be authorized', async () => {
      const res = await request(app).get('/api/sounds');
      expect(res.statusCode).toBe(401);
    });

    test('It should list sounds', async () => {
      const res = await request(app)
        .get('/api/sounds')
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(200);
      expect(res.header['content-type'])
        .toEqual('application/json; charset=utf-8');
      expect(res.body).toContain('test_sounds_file1.mp3');
      expect(res.body).toContain('test_sounds_file2.mp3');
    });

  });

  describe('play sound', () => {
    const { play } = require('../../src/api/sounds/player');

    afterEach(() => {
      play.mockClear();
    });

    test('It should not be authorized', async () => {
      const res = await request(app)
        .get('/api/sounds/sound.mp3');
      expect(res.statusCode).toBe(401);
    });

    test('It should not pass validation', async () => {
      const res = await request(app)
        .get('/api/sounds/image.jpg')
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(422);
    });

    test('Sound should not exist', async () => {
      const error = new Error('ENOENT');
      error.code = 2;
      play.mockImplementation((soundPath, cb) => cb(error));
      const res = await request(app)
        .get('/api/sounds/sound.mp3')
        .set({ Authorization: 'Bearer test_token' });
      expect(play).toHaveBeenCalled();
      expect(res.statusCode).toBe(404);
    });

    test('It should play sound', async () => {
      play.mockImplementation((soundPath, cb) => cb(null));
      const res = await request(app)
        .get('/api/sounds/sound.mp3')
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('');
    });

  });

  describe('remove sound', () => {

    test('It should not be authorized', async () => {
      const res = await request(app)
        .del('/api/sounds/sound.mp3');
      expect(res.statusCode).toBe(401);
    });

    test('It should not pass validation', async () => {
      const res = await request(app)
        .del('/api/sounds/image.jpg')
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(422);
    });

    test('Sound should not exist', async () => {
      const res = await request(app)
        .del('/api/sounds/sound.mp3')
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(404);
    });

    describe('sound exists', () => {
      const soundPath = path.join(config.SOUNDS_FOLDER, 'test_sound.mp3');

      beforeAll(async () => {
        await fsWriteFile(soundPath, 'fake content');
      });

      test('It should remove sound', async () => {
        const res = await request(app)
          .del('/api/sounds/test_sound.mp3')
          .set({ Authorization: 'Bearer test_token' });
        expect(res.statusCode).toBe(200);
        expect(res.text).toEqual('');
      });
    
    });
    
  });

  describe('add sound', () => {
    const soundPath = path.join(config.SOUNDS_FOLDER, 'test_sound.mp3');
    const url = 'https://raw.githubusercontent.com/felipewer/mock-files/master/mock_100_bytes.mp3';

    test('It should not be authorized', async () => {
      const res = await request(app)
        .post('/api/sounds')
        .send({});
      expect(res.statusCode).toBe(401);
    });

    test('It should not pass validation', async () => {
      const res = await request(app)
        .post('/api/sounds')
        .send({ soundName: 'sound.mp3', url: 'invalid_url' })
        .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(422);
    });

    test('It should add sound', async () => {
      const res = await request(app)
      .post('/api/sounds')
      .send({ soundName: 'test_sound', url })
      .set({ Authorization: 'Bearer test_token' });
      expect(res.statusCode).toBe(201);
      expect(res.text).toEqual('');
    });

    afterAll(async () => {
      await fsUnlink(soundPath);
    });

    describe('sound exists', () => {
      
      beforeAll(async () => {
        await fsWriteFile(soundPath, 'fake content');
      });
      
      test('Sound should already exist', async () => {
        const res = await request(app)
          .post('/api/sounds')
          .send({ soundName: 'test_sound', url })
          .set({ Authorization: 'Bearer test_token' });
        expect(res.statusCode).toBe(409);
      });
    
    });
    
  });
});