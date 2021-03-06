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
      if (data.rootIndex) {
        window.location = '/' + data.path + '/' + data.rootIndex;
      } else {
        window.location = '/' + data.path + '/';
      }
    } else {
      alert('Login failed: incorrect username or password');
    }
  }).fail(function(res) {
    alert('Login failed: network error');
    console.log(res);
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
    alert('Logout failed: network error');
    console.log(res);
  });
}

