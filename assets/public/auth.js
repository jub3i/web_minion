//login function
function login(username, password) {
  $.ajax({
    type: 'POST',
    url: '/login',
    async: true,
    data: {
      username: username,
      password: password,
    },
  }).done(function(data) {
    if (data.sc === 0) {
      window.location = '/' + data.path + '/';
    } else {
      alert('Login failed: incorrect username or password');
    }
  }).fail(function(res) {
    alert('Login failed: network error');
    console.err(res);
  });
}

//logout function
function logout() {
  $.ajax({
    type: 'POST',
    url: '/logout',
    async: true,
  }).done(function(data) {
    if (data.sc === 0) {
      window.location = '/';
    } else {
      alert('Logout failed');
    }
  }).fail(function(res) {
    console.err(res);
    alert('Logout failed');
  });
}

