var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

var indexRoutes = require('./routes/index');
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamps', {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

seedDB();

app.use(
  session({
    secret: 'thisisyelpcamp',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(5500, function() {
  console.log('Server Started!!');
});
