var express = require('express');
var Campground = require('../models/campground');

var router = express.Router();

router.get('/campgrounds', function(req, res) {
  Campground.find(function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds
      });
    }
  });
});

router.post('/campgrounds', function(req, res) {
  var newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  };
  Campground.create(newCampground, function(err, createdCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
      console.log(createdCampground.name);
    }
  });
});

router.get('/campgrounds/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

router.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
        console.log(req.user);
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
