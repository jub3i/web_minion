/*
 * USERS
 */

var users = [
  { user: 'john', pass: '123456', path: 'abc' },
  { user: 'sally', pass: '123456', path: 'abc' },
  { user: 'bob', pass: '123456', path: 'xyz' },
];

/*
 * MOUNT PATHS
 */

//var paths = [
//  'abc',
//  'xyz',
//];

/*
 * EXPORT
 */

module.exports = {
  users: users,
  //paths: paths,
  port: 3001,
};
