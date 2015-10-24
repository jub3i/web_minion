/*
 * REQUIRES
 */

var _ = require('underscore');
var path = require('path');
var PATH_SEP = path.sep;
var logFn = require(path.join(__dirname, PATH_SEP + 'logFn'));

/*
 * PROTECT PATH FN
 */

//this function returns a middleware function
var protectStaticPath = function(path) {
  return function(req, res, next) {
    //test for regex match
    var regex = new RegExp('^\/' + path + '\/.*$');
    if (!regex.test(req.url)) { return next(); }

    //if not logged in 403 immediately
    if (req.session.loggedIn === false) {
      res.status(403).end('403 Forbidden');
    }

    userIsAllowed(req.session.user, path, function(allowed) {
      if (allowed) {
        //send the request to the next handler, which is express.static
        next();
      } else {
        logFn('403 Forbidden on "' + req.url + '" (' + req.ip + ')');

        //log user info if session is present
        if (req.session.user) {
          logFn(req.session.user, true);
        }

        //return 403 forbidden
        res.status(403).end('403 forbidden');
      }
    });
  };
};

/*
 * PERMISSION CHECK HELPER
 */

function userIsAllowed(user, path, callback) {
  if (_.isUndefined(user)) {
    return callback(false);
  }

  if (user.path === path) {
    return callback(true);
  } else {
    return callback(false);
  }
}

module.exports = protectStaticPath;
