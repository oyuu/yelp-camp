var express = require('express');
var Campground = require('../models/campground');

var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
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

router.post('/', isLoggedIn, function(req, res) {
  var newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: { id: req.user.id, username: req.user.username }
  };
  Campground.create(newCampground, function(err, createdCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(createdCampground);
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

router.get('/:id/edit', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.render('campgrounds/edit', {
        Campground: foundCampground
      });
    }
  });
});

router.put('/:id', isLoggedIn, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + updatedCampground._id);
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
