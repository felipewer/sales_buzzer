const { checkSpeech } = require('./validator');

describe('checkSpeech', () => {
  
  test('speech is valid', async () => {
    const req = { body: { speech: 'some valid_speech' } };
    await checkSpeech(req, {}, () => {});
    expect(req._validationErrors).toEqual([]);
  });

  test('speech is missing', async () => {
    const req = { body: {} };
    await checkSpeech(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(3);
    expect(errors[0].msg)
      .toBe('Should contain up to 140 word characters');
  });

  test('speech length is in range [ 1, 140 ]', async () => {
    const reqUnder = { body: { speech: '' } };
    const reqOver = { body: { speech: 'a'.repeat(141) } };
    await checkSpeech(reqUnder, {}, () => {});
    await checkSpeech(reqOver, {}, () => {});
    const errorsUnder = reqUnder._validationErrors;
    const errorsOver = reqOver._validationErrors;
    expect(errorsUnder).toHaveLength(2);
    expect(errorsOver).toHaveLength(1);
    const expectedText = 'Should contain up to 140 word characters';
    expect(errorsUnder[0].msg).toEqual(expectedText);
    expect(errorsOver[0].msg).toEqual(expectedText);
  });

  test('speech has invalid characters', async () => {
    const req = { body: { speech: 'some / .inv@lid_speech' } };
    await checkSpeech(req, {}, () => {});
    const errors = req._validationErrors;
    expect(errors).toHaveLength(1);
    expect(errors[0].msg)
      .toBe('Should contain up to 140 word characters');
  });

})