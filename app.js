/*
 * REQUIRES
 */

//express
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');

//utility
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

//libs
var PATH_SEP = path.sep;
var protectPath = require(path.join(__dirname, PATH_SEP + 'lib' + PATH_SEP + 'protectPath'));
var logFn = require(path.join(__dirname, PATH_SEP + 'lib' + PATH_SEP + 'logFn'));

/*
 * VARS
 */

var assetPath = path.join(__dirname, PATH_SEP + 'assets');

var publicPath = assetPath + PATH_SEP + 'public';

var loginHtmlPath = publicPath + PATH_SEP + 'login.html';
var loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

//permission check helper
var userIsAllowed = function(req, path, cb) {
  //if not logged in 403 immediately
  if (req.session.loggedIn === false) {
    return cb(false);
  }

  //if no user object on session 403
  if (_.isUndefined(req.session.user)) {
    return cb(false);
  }

  //if path matches with allowed path on user session then allow
  if (req.session.user.path === path) {
    return cb(true);

  //otherwise 403
  } else {
    return cb(false);
  }
};

/*
 * READ CONFIG FILE
 */

var config;

try {
  config = require(path.join(__dirname, PATH_SEP + 'config'));
} catch (err) {
  logFn('ERROR: could not load `./config.js` (TIP: create a config file ' +
    'from `./config_example.js`)\n');
  logFn(err, true);
  process.exit(1);
}

/*
 * PROCESS CONFIG
 */

//get unique protected paths
var paths = _.uniq(_.pluck(config.users, 'path'));

/*
 * EXPRESS INIT
 */

var app = express();

//middleware: session
app.use(session({
  secret: 'ak$&#lk#49&*',
  resave: false,
  saveUninitialized: true,
  name: 'sid',
  cookie: {
    path: '/',
    maxAge: null,
    secure: false, //https only
    httpOnly: true,
  },
}));

//middleware: for parsing application/json
app.use(bodyParser.json());

//middleware: for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * EXPRESS ROUTES
 */

//the root route is the login page
app.get('/', function(req, res) {
  logFn('serving login page to: ' + req.ip);
  res.end(loginHtml);
});

//mount protected paths
paths.forEach(function(path) {
  app.use(protectPath(path, userIsAllowed, function(allow, req, res, next) {
    if (allow) {
      return next();
    } else {
      logFn('403 Forbidden on "' + req.url + '" (' + req.ip + ')');

      //log user info if session is present
      if (req.session.user) {
        logFn(req.session.user, true);
      }

      //return 403 forbidden
      res.status(403).end('403 forbidden');
    }
  }));
  app.use('/' + path, express.static(assetPath + PATH_SEP + path));
});

//otherwise, serve public static assets
app.use('/', express.static(publicPath));

//post login route
app.post('/login', function(req, res) {
  //look up user
  var result = _.find(config.users, function(user) {
    if (user.username === req.body.username) {
      return true;
    } else {
      return false;
    }
  });

  //check if we found a user
  if (_.isUndefined(result)) {
    logFn('failed login from ' + req.ip);
    logFn(req.body, true);
    res.send({ sc: 1 });

  //check users password
  } else if (result.password === req.body.password) {
    //store successful login on session
    req.session.user = result;
    req.session.loggedIn = true;

    logFn('successful login for ' + result.username + ' (' + req.ip + ')');

    //send back success and a path to redirect to
    res.send({ sc: 0, path: result.path });

  //password did not match
  } else {
    logFn('failed login from ' + req.ip);
    logFn(req.body, true);
    res.send({ sc: 1 });
  }
});

//post logout route
app.post('/logout', function(req, res) {
  req.session.loggedIn = false;
  logFn('successful logout for ' + req.session.user.username + ' (' + req.ip + ')');
  res.send({ sc: 0 });
});

/*
 * WEB SERVER INIT
 */

http.createServer(app).listen(config.port, function() {
  logFn('listening on port ' + config.port);
});
