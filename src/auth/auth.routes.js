const passport = require('passport')
const express = require('express');

const router = express.Router()

router.get('/github',
  passport.authenticate('github', { scope: 'read:org', session: false })
);


router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/', session: false }),
  (req, res) => {
    // Successful authentication, load access_token into client storage.
    // res.render('access_token', { accessToken: req.user.accessToken });
    res.redirect(`/#&access_token=${req.user.accessToken}`);
  }
);

module.exports = router;