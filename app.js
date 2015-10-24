/*
 * REQUIRES
 */

var express = require('express');
var session = require('express-session');
var http = require('http');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var bodyParser = require('body-parser');

var PATH_SEP = path.sep;
var protectStaticPath = require(path.join(__dirname, PATH_SEP + 'lib' + PATH_SEP + 'protectStaticPath'));

var logFn = require(path.join(__dirname, PATH_SEP + 'lib' + PATH_SEP + 'logFn'));

/*
 * VARS
 */

var assetPath = path.join(__dirname, PATH_SEP + 'assets');

var publicPath = assetPath + PATH_SEP + 'public';

var loginHtmlPath = publicPath + PATH_SEP + 'login.html';
var loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');


/*
 * READ CONFIG FILE
 */

var config;

try {
  config = require(path.join(__dirname, PATH_SEP + 'config'));
} catch (err) {
  logFn('ERROR: could not load `./config.js` (TIP: create a config file from `./config_example.js`)\n');
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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: 'gdm.sid',
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
  app.use(protectStaticPath(path));
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
    req.session.user = result;
    req.session.loggedIn = true;
    logFn('successful login for ' + result.username + ' (' + req.ip + ')');
    res.send({ sc: 0, path: result.path });

  //password did not match
  } else {
    logFn('failed login from ' + req.ip);
    logFn(req.body, true);
    res.send({ sc: 1 });
  }
});

//post login route
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
