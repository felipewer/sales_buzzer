const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const authSetup = require('./auth/setup');
const auth = require('./auth/auth.routes');
const sounds = require('./api/sounds/sounds.routes');
const speech = require('./api/speech/speech.routes');
const errorHandler = require('./util/error_handler');

const app = express();

authSetup.configure(app)

app.use('/', express.static(path.join(__dirname, '..', '/public')));
app.use('/auth', auth);
app.use('/api', sounds, speech , errorHandler);

app.get('/login', (req, res) => res.redirect('/'));

if (!fs.existsSync(config.DB_FOLDER)) {
  fs.mkdirSync(config.DB_FOLDER);
  fs.mkdirSync(config.SOUNDS_FOLDER);
  fs.mkdirSync(config.TOKENS_FOLDER);
}

app.listen(config.PORT, () => {
    console.log(`Startup Buzzer listening on port ${config.PORT}!`)
});
