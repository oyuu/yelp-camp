var express = require('express');
var Campground = require('../models/campground');
var Comment = require('../models/comment');

var router = express.Router();

router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      res.redirect('/campgrounds' + campground._id);
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());
    return next();
  }
  console.log(req.isAuthenticated());
  res.redirect('/login');
}

module.exports = router;
