const request = require('supertest');
const app = require('../src/app')

describe('root route', () => {

  test('It showld respond with html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type'])
      .toEqual('text/html; charset=UTF-8');
    expect(res.text).not.toEqual('');
  });

});
