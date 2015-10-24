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

    userIsAllowed(req.session.user, path, function(allowed) {
      if (allowed) {
        //send the request to the next handler, which is express.static
        next();
      } else {
        logFn('403 Forbidden on "' + req.url + '" (' + req.ip + ')');
        if (req.session.user) {
          logFn(req.session.user, true);
        }
        res.status(403).end('403 Forbidden');
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
