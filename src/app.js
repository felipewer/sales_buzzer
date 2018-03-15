const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const { Observable } = require('rxjs/Rx');
const player = require('play-sound')(opts = {});
const speaker = require('./speaker');
const onFsError = require('./fs_error');
const notFound = require('./not_found')

require('dotenv').config();

const port = process.env.PORT || 8080;
const sndsDir = path.join(__dirname, '..', 'sounds');

const app = express();
const jsonParser = bodyParser.json();

const fsOpen = Observable.bindNodeCallback(fs.open);
const fsReaddir = Observable.bindNodeCallback(fs.readdir);
const fsUnlink = Observable.bindNodeCallback(fs.unlink);


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
