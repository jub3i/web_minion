$(document).ready(function() {
  $('#loginBtn').click(function() {
    login($('#unInput').val(), $('#pwInput').val());
  });

  $('#cancelBtn').click(function() {
    $('#unInput').val('');
    $('#pwInput').val('');
  });
});
