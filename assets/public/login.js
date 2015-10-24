$(document).ready(function() {
  $.ajax({
    type: 'POST',
    url: '/login',
    async: true,
    data: {
      email: $('#unInput').val(),
      password: $('#pwInput').val(),
    },
  }).done(function(data) {
    console.log(data);
  }).fail(function(res) {
    console.log(res);
  });
});
