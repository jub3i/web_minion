/*
 * READ CONFIG FILE
 */

var path = require('path');
var config = require(path.join(__dirname, '..' + path.sep + 'config'));

/*
 * PROTECT PATH FN
 */

//this function returns a middleware function
var protectStaticPath = function(regex) {
  return function(req, res, next) {
    //test for regex match
    if (!regex.test(req.url)) { return next(); }

    userIsAllowed(function(allowed) {
      if (allowed) {
        //send the request to the next handler, which is express.static;
        next();
      } else {
        res.status(403).end('403 Forbidden');
      }
    });
  };
};

/*
 * PERMISSION CHECK HELPER
 */

function userIsAllowed(callback) {
  //TODO: check if user is allowed to access this asset
  config.users.forEach(function(user) {
    console.log(user);
  });
  callback(false);
}

module.exports = protectStaticPath;
