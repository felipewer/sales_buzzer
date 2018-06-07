const request = require('request');
const { intersect } = require('../util/intersect');
const tokens = require('./tokens');


const validateToken = async (token) => {
  try {
    const ttl = await tokens.get(token);
    return (ttl > Date.now());
  } catch(err) {
    if (err.code !== 'ENOENT') throw err;
    return false;
  }
}


const github = (appName, authorizedOrgs, tokenMaxAge) => 
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

      const ttl = Date.now() + tokenMaxAge;
      tokens.put(accessToken, ttl)
        .then(() => cb(null, { accessToken }))
        .catch(err => {
          console.error(err);
          cb('Server error', null);
        });
    });
  }

const bearer = () => (token, cb) => {
    if (!token) return cb(null, false);

    validateToken(token).then(valid => {
      cb(null, (valid ? {} : false))
    });
  }

module.exports = { github, bearer }