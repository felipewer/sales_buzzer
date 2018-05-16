const boom = require('boom');
const speaker = require('./speaker');

exports.speak = (req, res, next) => {
  const { speech }  = req.body;
  speaker.speak(speech, (err) => {
    if(err) {
      return next(bomm.badImplementation(err));
    }
    res.send();
  });
}