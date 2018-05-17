const {
  checkFileName,
  checkName,
  checkUrl
} = require('./validator');

describe('checkName', () => {
  
  test('soundName is valid', async () => {
    const req = { body: { soundName: 'back_in_black' } };
    await checkName(req, {}, () => {});
    expect(req._validationErrors).toEqual([]);
  });

  test('soundName is missing', async () => {
    const req = { body: {} };
    await checkName(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(3);
    expect(errors[0].msg)
      .toBe('Should contain up to 50 word characters');
  });

  test('soundName length is in range [ 1, 50 ]', async () => {
    const reqUnder = { body: { soundName: '' } };
    const reqOver = { body: { soundName: 'a'.repeat(51) } };
    await checkName(reqUnder, {}, () => {});
    await checkName(reqOver, {}, () => {});
    const errorsUnder = reqUnder._validationErrors;
    const errorsOver = reqOver._validationErrors;
    expect(errorsUnder).toHaveLength(2);
    expect(errorsOver).toHaveLength(1);
    const expectedText = 'Should contain up to 50 word characters';
    expect(errorsUnder[0].msg).toEqual(expectedText);
    expect(errorsOver[0].msg).toEqual(expectedText);
  });

  test('soundName has invalid characters', async () => {
    const req = { body: { soundName: 'invalid/ n@me' } };
    await checkName(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(1);
    expect(errors[0].msg)
      .toBe('Should contain up to 50 word characters');
  });

});

describe('checkFileName', () => {
  
  test('soundName is valid', async () => {
    const req = { body: { soundName: 'back_in_black.mp3' } };
    await checkFileName(req, {}, () => {});
    expect(req._validationErrors).toEqual([]);
  });

  test('soundName is missing', async () => {
    const req = { body: {} };
    await checkFileName(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(3);
    expect(errors[0].msg)
      .toBe('Invalid identifier');
  });

  test('soundName length is in range [ 1, 54 ]', async () => {
    const reqUnder = { body: { soundName: '' } };
    const reqOver = { body: { soundName: 'a'.repeat(54) } };
    await checkFileName(reqUnder, {}, () => {});
    await checkFileName(reqOver, {}, () => {});
    const errorsUnder = reqUnder._validationErrors;
    const errorsOver = reqOver._validationErrors;
    expect(errorsUnder).toHaveLength(2);
    expect(errorsOver).toHaveLength(1);
    const expectedText = 'Invalid identifier';
    expect(errorsUnder[0].msg).toEqual(expectedText);
    expect(errorsOver[0].msg).toEqual(expectedText);
  });

  test('soundName has invalid characters', async () => {
    const req = { body: { soundName: 'invalid/name.jpg' } };
    await checkFileName(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(1);
    expect(errors[0].msg)
      .toBe('Invalid identifier');
  });

});

describe('checkUrl', () => {
  
  test('url is well formed', async () => {
    const req = { body: { url: 'http://domain.com/back_in_black.mp3' } };
    await checkUrl(req, {}, () => {});
    expect(req._validationErrors).toEqual([]);
  });

  test('url is missing', async () => {
    const req = { body: {} };
    await checkUrl(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(3);
    expect(errors[0].msg)
      .toBe('Supported file extensions are wav and mp3');
  });

  test('url is not well formed', async () => {
    const req = { body: { url: 'ht/path name.jpg' } };
    await checkUrl(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(2);
    expect(errors[0].msg)
      .toBe('Supported file extensions are wav and mp3');
  });

  test('url has unsuported file extension', async () => {
    const req = { body: { url: 'http://domain.com/back_in_black.jpg' } };
    await checkUrl(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(1);
    expect(errors[0].msg)
      .toBe('Supported file extensions are wav and mp3');
  });

});