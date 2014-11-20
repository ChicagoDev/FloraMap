var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'), 
    morgan = require('morgan'),
    errorhandler = require('errorhandler'),
    plant = require('./routes/plants'),
    app = express();

/*
// Used for authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
*/

process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') {
    
    // You can set the port used here
    app.set('port', process.env.PORT || 3000);
    
    app.use(errorhandler())
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));
};

// Add the routes
app.get('/plants', plant.findAll);
app.get('/plants/:id', plant.findById);
app.post('/plants', plant.addPlant);
app.put('/plants/:id', plant.updatePlant);
app.delete('/plants/:id', plant.deletePlant);

// Create and start the server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});



/*
** Code from tests trying to use authentication
**

app.get('/login', function(req, res) {
  res.sendfile('public/template/PlantListItemView.html');
});


app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/HomeView',
    failureRedirect: '/PlantView'
})
  );

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserDetails.findOne({
      'username': username, 
  }, function(err, user) {
      if (err) {
        return done(err);
    }

    if (!user) {
        return done(null, false);
    }

    if (user.password != password) {
        return done(null, false);
    }

    res.render('HomeView.html');
    return done(null, user);
});
});
}));

var mongoose = require('mongoose/');

mongoose.connect('mongodb://localhost:27017/plantdb');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
  username: String,
  password: String
}, {
  collection: 'userInfo'
});
var UserDetails = mongoose.model('userInfo', UserDetail); */