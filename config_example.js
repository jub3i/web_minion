/*
 * USERS
 */

var users = [
  { username: 'john', password: '123456', path: 'abc' },
  { username: 'sally', password: '123456', path: 'abc' },
  { username: 'bob', password: '123456', path: 'xyz' },
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
