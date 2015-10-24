/*
 * REQUIRES
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var PATH_SEP = path.sep;
var protectStaticPath = require(path.join(__dirname, PATH_SEP + 'lib' + PATH_SEP + 'protectStaticPath'));

/*
 * VARIABLES
 */

var version = '0.1';

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
  console.log('ERROR: could not load `./config.js` (TIP: create a config file from `./config_example.js`)\n');
  console.log(err);
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

/*
 * EXPRESS ROUTES
 */

//the root route is the login path
app.get('/', function(req, res) {
  console.log('Serving login page to: ' + req.ip);
  res.end(loginHtml);
});

//mount protected paths
paths.forEach(function(path) {
  var regex = new RegExp('^\/' + path + '\/.*$');
  app.use(protectStaticPath(regex));
  app.use('/' + path, express.static(assetPath + PATH_SEP + path));
});

//otherwise, serve public static assets
app.use('/', express.static(publicPath));

/*
 * WEB SERVER INIT
 */

http.createServer(app).listen(config.port, function() {
  console.log('WebMinion v' + version + ' listening on port ' + config.port);
});
