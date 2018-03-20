const passport = require('passport')
const request = require('request');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('../config')
const { intersect } = require('../util');

const oauthOptions = {
  clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
  clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  callbackURL: `${process.env.OAUTH_CALLBACK_URL}/auth/github/callback`
}

const verify = (accessToken, refreshToken, profile, cb) => {
  const reqOptions = {
    url: 'https://api.github.com/user/orgs',
    headers: { 'User-Agent': 'Startup Buzzer' },
    auth: { bearer: accessToken }
  };
  request(reqOptions, (err, res, body) => {
    const userOrgs = JSON.parse(body).map(o => o.login);
    if (intersect(userOrgs, config.AUTHORIZED_ORGS)){
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

passport.use(new GitHubStrategy(oauthOptions, verify));

const configure = (app) => app.use(passport.initialize());

module.exports = { configure }