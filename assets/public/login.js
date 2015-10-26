$(document).ready(function() {
  $('#loginBtn').click(function() {
    var username = $('#unInput').val();
    var password = $('#pwInput').val();
    login(username, password);
  });

  $('#cancelBtn').click(function() {
    //clear inputs on cancel btn
    $('#unInput').val('');
    $('#pwInput').val('');
  });
});
