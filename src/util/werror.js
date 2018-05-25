class Werror extends Error {
  constructor(message, code) {
    if (!code) throw new Error('Missing argument: code');
    super(message);
    this.code = code;
  }
}

module.exports = Werror;