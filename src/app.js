const express = require('express');
const path = require('path');
const helmet = require('helmet');
const authSetup = require('./auth/setup');
const auth = require('./auth/routes');
const sounds = require('./api/sounds/routes');
const speech = require('./api/speech/routes');
const errorHandler = require('./util/error_handler');

const app = express();

app.use(helmet());

authSetup.configure(app)

app.use('/', express.static(path.join(__dirname, '..', '/public')));
app.use('/auth', auth);
app.use('/api', sounds, speech , errorHandler);

app.get('/login', (req, res) => res.redirect('/'));

module.exports = app;
