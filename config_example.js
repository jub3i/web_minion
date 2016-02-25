/*
 * USERS
 */

var users = [
  // on login will redirect to `/abc/aa.html`
  { username: 'john', password: '123456', path: 'abc', rootIndex: 'aa.html' },
  // on login will redirect to `/abc/`, browser will automatically look for `/abc/index.html`
  { username: 'sally', password: '123456', path: 'abc' },
  // on login will redirect to `/xyz/`, browser will automatically look for `/xyz/index.html`
  { username: 'bob', password: '123456', path: 'xyz' },
];

/*
 * EXPORT
 */

module.exports = {
  users: users,
  port: 3001,
};
