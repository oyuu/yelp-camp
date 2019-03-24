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
    req.flash(
      'success',
      'Successfully Signed Up! Nice to meet you ' + user.username
    );
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
    failureRedirect: '/login',
    failureFlash: 'Login invalid'
  }),
  function(req, res) {
    req.flash('success', 'Welcome back ' + req.user.username + '!');
    res.redirect('/campgrounds');
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out!');
  res.redirect('/campgrounds');
});

module.exports = router;
