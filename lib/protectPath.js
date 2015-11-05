/*
 * PROTECT STATIC PATH MIDDLEWARE GENERATING FUNCTION
 *
 * protectPath(path, checkFunction, cb)
 *
 * `path`: eg. 'my_path' would protect paths like www.site.com/my_path/*
 *
 * `check`: the function signature is check(req, path, cb)
 *   `req`: is the express request object
 *   `path`: is the path specified above
 *   `cb`: is a callback with signature cb(allow) where `allow` is boolean
 *
 * `cb` is a callback with signature cb(allow, req, res, next)
 *  which intends to give control on how express responds to `allow` boolean
 *
 */

//this function returns an express middleware function
module.exports = function protectPath(path, check, cb) {
  return function(req, res, next) {

    //if path does not match the url, go to next middleware
    var regex = new RegExp('^\/' + path + '\/.*$');
    if (!regex.test(req.url)) {
      return next();
    }

    //exec check fn to see if access to path should be allowed
    check(req, path, function(allow) {
      if (allow) {
        return cb(true, req, res, next);
      } else {
        return cb(false, req, res, next);
      }
    });
  };
};
