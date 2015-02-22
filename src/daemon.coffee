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
    
    dateBeatiful = (data)->
      if data > 9 then data else "0#{data}"

    dateNow = ()->
      now = new Date
      result = "#{dateBeatiful(now.getDate())}"
      result += "/#{dateBeatiful(now.getMonth()+1)}"
      result += "/#{now.getFullYear()}"
      result += " #{dateBeatiful(now.getHours())}"
      result += ":#{dateBeatiful(now.getMinutes())}"
      result += ":#{dateBeatiful(now.getSeconds())}"
      result

    console.log = ()->
      datas = ""
      if arguments.length
        for data in arguments
          log_file.write "#{dateNow()} [LOG]: #{data}\n"
          datas = "#{datas}#{data}\n"
      process.stdout.write datas

    console.error = (data)->
      datas = ""
      if arguments.length
        for data in arguments
          log_file.write "#{dateNow()} [ERROR]: #{data}\n"
          datas = "#{datas}#{data}\n"
      process.stdout.write datas

    console.dir = (data)->
      datas = ""
      if arguments.length
        for data in arguments
          msg = util.inspect(data)
          log_file.write "#{dateNow()} [DIR]: #{msg}\n"
          datas = "#{datas}#{msg}\n"
      process.stdout.write datas