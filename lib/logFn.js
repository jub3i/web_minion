module.exports = function(msg, omit) {
  var timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  if (omit !== true) {
    console.log(timestamp, '[WebMinion]', msg);
  } else {
    console.log(timestamp, '           ', msg);
  }
};

