(function() {
  var fs, util;

  fs = require("fs");

  util = require("util");

  module.exports = function(name, log, pid) {
    var dateBeautiful, dateNow, error, folder_log, folder_pid, log_file, pid_file, process_stderr, process_stdout;
    if (name == null) {
      name = null;
    }
    if (log == null) {
      log = true;
    }
    if (pid == null) {
      pid = true;
    }
    folder_log = "/var/log/";
    folder_pid = "/var/run/";
    if (!name) {
      name = process.argv[1].split("/");
      name = name[name.length - 1].replace(/\.js/g, "");
    }
    if (pid) {
      pid_file = "" + folder_pid + name + ".pid";
      if (error = fs.writeFileSync(pid_file, process.pid)) {
        throw error;
      } else {
        process.on('exit', function() {
          return fs.unlinkSync(pid_file);
        });
        process.on('SIGTERM', function() {
          return process.exit();
        });
        process.on('SIGINT', function() {
          return process.exit();
        });
        process.on('uncaughtException', function(err) {
          return console.error(err.stack.toString());
        });
      }
    }
    if (log) {
      log_file = fs.createWriteStream("" + folder_log + name + ".log", {
        flags: "a+"
      });
      dateBeautiful = function(data) {
        if (data > 9) {
          return data;
        } else {
          return "0" + data;
        }
      };
      dateNow = function() {
        var now, result;
        now = new Date;
        result = "" + (dateBeautiful(now.getDate()));
        result += "/" + (dateBeautiful(now.getMonth() + 1));
        result += "/" + (now.getFullYear());
        result += " " + (dateBeautiful(now.getHours()));
        result += ":" + (dateBeautiful(now.getMinutes()));
        result += ":" + (dateBeautiful(now.getSeconds()));
        return result;
      };
      process_stdout = process.stdout.write.bind(process.stdout);
      process.stdout.write = function(data) {
        log_file.write((dateNow()) + " [LOG]: " + data);
        return process_stdout(data);
      };
      process_stderr = process.stderr.write.bind(process.stderr);
      return console.error = function(data) {
        log_file.write((dateNow()) + " [ERROR]: " + data);
        return process_stderr(data);
      };
    }
  };

}).call(this);
