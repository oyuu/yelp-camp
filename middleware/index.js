var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {
  checkCampgroundOwnership: function(req, res, next) {
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
  },
  checkCommentOwnership: function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (foundComment.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.redirect('back');
        }
      });
    } else {
      res.redirect('/login');
    }
  },
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
