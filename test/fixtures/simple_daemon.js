(function() {
  require('../../dist/daemon.js')();

  console.log("Log, " + (new Date()));

  console.error("Erro, " + (new Date()));

}).call(this);
