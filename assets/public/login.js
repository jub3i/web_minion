$(document).ready(function() {
  $('#loginBtn').click(function() {
    login($('#unInput').val(), $('#pwInput').val());
  });
});
