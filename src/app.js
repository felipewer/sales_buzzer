const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const passport = require('passport')
const request = require('request');
const { Observable } = require('rxjs/Rx');
const player = require('play-sound')(opts = {});

const speaker = require('./speaker');
const onFsError = require('./fs_error');
const notFound = require('./not_found')

const { intersect } = require('./util');

require('dotenv').config();


const port = process.env.PORT || 8080;
const sndsDir = path.join(__dirname, '..', 'sounds');

const app = express();
const jsonParser = bodyParser.json();

const fsOpen = Observable.bindNodeCallback(fs.open);
const fsReaddir = Observable.bindNodeCallback(fs.readdir);
const fsUnlink = Observable.bindNodeCallback(fs.unlink);

// Auth
const authorizedOrgs = process.env.AUTHORIZED_ORGS.split(',').map(o => o.trim());

const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_CALLBACK_URL}/auth/github/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    const options = {
      url: 'https://api.github.com/user/orgs',
      headers: { 'User-Agent': 'Startup Buzzer' },
      auth: { bearer: accessToken }
    };
    request(options, (err, res, body) => {
      const userOrgs = JSON.parse(body).map(o => o.login);
      if (intersect(userOrgs, authorizedOrgs)){
        cb(null, { accessToken });
      } else {
        const message = 'insufficient organizational access rights';
        cb(null, false, { message });
      }
    });
    // User.findOrCreate(
    //   { githubId: profile.id },
    //   (err, user) => cb(err, user)
    // );
    // console.log('Token', accessToken);
    // console.log('Profile', JSON.stringify(profile._json, null, 2));
  }
));

app.use(passport.initialize());

app.get('/auth/github',
  passport.authenticate('github', { scope: 'read:org', session: false })
);


app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/', session: false }),
  (req, res) => {
    // Successful authentication, load access_token into client storage.
    res.render('access_token', { accessToken: req.user.accessToken });
  }
);


// --------------------

app.set('view engine', 'ejs');


app.get('/', (req,res) => {
  res.send('<h1>Startup Buzzer</h1><a href="/auth/github">Log In with Github</a>');
});


app.get('/sounds', (req, res) => {
  fsReaddir(sndsDir).subscribe(
    files => res.status(200).json(files),
    onFsError(res)
  );
});

app.post(`/sounds`, jsonParser, (req, res) => {
  const {sound, url} = req.body
  const soundPath = path.join(sndsDir, sound)
  fsOpen(soundPath, 'wx')
    .subscribe(
      fd => {
        request(url)
          .on('error', err => res.status(400).send())
          .on('response', resp => res.status(201).send())  
          .pipe(fs.createWriteStream('', { fd }))
      },  
      onFsError(res)
    );  
});  

app.get('/sounds/:soundName', notFound(sndsDir), (req, res) => {
  const soundPath = path.join(sndsDir, req.params.soundName)
  player.play(soundPath, (err) => {
    if(err) {
      console.error(err);
      res.status(500).send();
    }else{
      res.status(200).send();
    }
  });
});

app.delete('/sounds/:soundName', notFound(sndsDir), (req, res) => {
  const soundPath = path.join(sndsDir, req.params.soundName)
  fsUnlink(soundPath).subscribe(
    () => res.status(200).send(),
    onFsError(res)
  )
});

app.post('/speech', jsonParser, (req, res) => {
  speaker.speak(req.body.speech, (err) => {
    if(err) {
      console.error(err);
      res.status(500).send();
    }else{
      res.status(200).send();
    }
  });
});  



if (!fs.existsSync(sndsDir)) fs.mkdirSync(sndsDir);

app.listen(port, () => {
    console.log(`Startup Buzzer listening on port ${port}!`)
});
