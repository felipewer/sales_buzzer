const fs = require('fs');
const path = require('path');
const request = require('request');
const { Observable } = require('rxjs/Rx');
const { intersect } = require('../util/intersect');

const fsWriteFile = Observable.bindNodeCallback(fs.writeFile);
const fsStat = Observable.bindNodeCallback(fs.stat);

const saveToken = (basePath, accessToken) => {
  const tokenPath = path.join(basePath, accessToken);
  return fsWriteFile(tokenPath, '');
}

const validateToken = (basePath, maxAge, token) => {
  const tokenPath = path.join(basePath, token);
  return fsStat(tokenPath)
    .map(({ birthtimeMs }) => (Date.now() - birthtimeMs))
    .map(age => (age < maxAge))
    .catch(err => {
      if (err.code !== 'ENOENT') console.error(err);
      return Observable.of(false);
    });
}

const github = (appName, authorizedOrgs, tokensFolder) => 
  (accessToken, refreshToken, profile, cb) => {
    const reqOptions = {
      url: 'https://api.github.com/user/orgs',
      headers: { 'User-Agent': appName },
      auth: { bearer: accessToken }
    };

    request(reqOptions, (err, res, body) => {
      if (err) {
        console.error(err);
        return cb('Server error', null);
      }
      const userOrgs = JSON.parse(body).map(o => o.login);
      const authorized = intersect(userOrgs, authorizedOrgs)
      
      if (!authorized) {
        const message = 'Insufficient organizational access rights';
        return cb(null, false, { message });
      }

      saveToken(tokensFolder, accessToken)
      .subscribe(
        () => cb(null, { accessToken }),
        err => {
          console.error(err);
          cb('Server error', null);
        }
      );
    });
  }

const bearer = (tokensFolder, tokenMaxAge) =>
  (token, cb) => {
    if (!token) return cb(null, false);

    validateToken(tokensFolder, tokenMaxAge, token)
      .subscribe(valid => cb(null, (valid ? {} : false)));
  }

module.exports = { github, bearer }