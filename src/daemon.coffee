fs = require "fs"
util = require "util"

module.exports = (name=null, log=true, pid=true)->
  
  folder_log = "/var/log/"
  folder_pid = "/var/run/"

  unless name
    name = process.argv[1].split "/"
    name = name[name.length-1].replace /\.js/g, ""

  if pid
    pid_file = "#{folder_pid}#{name}.pid"
    if error = fs.writeFileSync pid_file, process.pid
      throw error
    else
      process.on 'exit', ()->
        fs.unlinkSync pid_file
        
      process.on 'SIGTERM', ()->
        process.exit()
        
      process.on 'SIGINT', ()->
        process.exit()

      process.on 'uncaughtException', (err)->
        console.error err.stack.toString()

  if log
    log_file = fs.createWriteStream "#{folder_log}#{name}.log", {flags: "a+"}

    process_stdout = process.stdout.write.bind process.stdout
    process.stdout.write = (data)->
      log_file.write "[LOG]: #{data}"
      process_stdout data

    process_stderr = process.stderr.write.bind process.stderr
    console.error = (data)->
      log_file.write "[ERROR]: #{data}"
      process_stderr data