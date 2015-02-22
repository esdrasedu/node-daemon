(function() {
  var fs, util;

  fs = require("fs");

  util = require("util");

  module.exports = function(name, log, pid) {
    var dateBeatiful, dateNow, error, folder_log, folder_pid, log_file, pid_file;
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
      dateBeatiful = function(data) {
        if (data > 9) {
          return data;
        } else {
          return "0" + data;
        }
      };
      dateNow = function() {
        var now, result;
        now = new Date;
        result = "" + (dateBeatiful(now.getDate()));
        result += "/" + (dateBeatiful(now.getMonth() + 1));
        result += "/" + (now.getFullYear());
        result += " " + (dateBeatiful(now.getHours()));
        result += ":" + (dateBeatiful(now.getMinutes()));
        result += ":" + (dateBeatiful(now.getSeconds()));
        return result;
      };
      console.log = function() {
        var data, datas, i, len;
        datas = "";
        if (arguments.length) {
          for (i = 0, len = arguments.length; i < len; i++) {
            data = arguments[i];
            log_file.write((dateNow()) + " [LOG]: " + data + "\n");
            datas = "" + datas + data + "\n";
          }
        }
        return process.stdout.write(datas);
      };
      console.error = function(data) {
        var datas, i, len;
        datas = "";
        if (arguments.length) {
          for (i = 0, len = arguments.length; i < len; i++) {
            data = arguments[i];
            log_file.write((dateNow()) + " [ERROR]: " + data + "\n");
            datas = "" + datas + data + "\n";
          }
        }
        return process.stdout.write(datas);
      };
      return console.dir = function(data) {
        var datas, i, len, msg;
        datas = "";
        if (arguments.length) {
          for (i = 0, len = arguments.length; i < len; i++) {
            data = arguments[i];
            msg = util.inspect(data);
            log_file.write((dateNow()) + " [DIR]: " + msg + "\n");
            datas = "" + datas + msg + "\n";
          }
        }
        return process.stdout.write(datas);
      };
    }
  };

}).call(this);
