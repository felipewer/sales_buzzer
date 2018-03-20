const speaker = require('./speaker');

exports.speak = (req, res) => {
  speaker.speak(req.body.speech, (err) => {
    if(err) {
      console.error(err);
      res.status(500).send();
    }else{
      res.status(200).send();
    }
  });
}