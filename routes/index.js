var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('landing');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('register');
    }
    req.flash('success', 'Welcome to YelpCamp ' + user.username);
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    successFlash: 'Welcome!'
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out!');
  res.redirect('/');
});

module.exports = router;
