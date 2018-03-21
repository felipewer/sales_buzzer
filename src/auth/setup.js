const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const config = require('../config');
const verifier = require('./verifier');

const oauthOptions = {
  clientID: config.GITHUB_OAUTH_CLIENT_ID,
  clientSecret: config.GITHUB_OAUTH_CLIENT_SECRET,
  callbackURL: `${config.OAUTH_CALLBACK_URL}/auth/github/callback`
}

passport.use(new GitHubStrategy(
  oauthOptions,
  verifier.github(
    config.APP_NAME,
    config.AUTHORIZED_ORGS,
    config.TOKENS_FOLDER
  )
));

passport.use(new BearerStrategy(
  verifier.bearer(
    config.TOKENS_FOLDER,
    config.OAUTH_TOKEN_MAX_AGE
  )
));

const configure = (app) => {
  app.use(passport.initialize());
  app.use('/api', passport.authenticate('bearer', { session: false }))
}

module.exports = { configure }