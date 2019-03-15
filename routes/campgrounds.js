var express = require('express');
var Campground = require('../models/campground');
var Comment = require('../models/comment');

var router = express.Router();

router.get('/', function(req, res) {
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

router.post('/', function(req, res) {
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

router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.render('campgrounds/edit', {
        campground: foundCampground
      });
    }
  });
});

router.put('/:id', checkCampgroundOwnership, function(req, res) {
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

router.delete('/:id', checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, removedCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      Comment.deleteMany({ _id: { $in: removedCampground.comments } }, function(
        err
      ) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/campgrounds');
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (foundCampground.author.id.equals(req.user._id)) {
        return next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
