// Asynchronous child_process and file system dependencies
const spawn = require('child_process').spawn, fs = require("fs")
let clusterlist, clusterlistkeys, iponly = []

// Parsing hosts.json file in config
fs.readFile(__dirname + "/config/hosts.json", 'utf8', function(err,data){
  if(err){
    const consolered = "\x1b[31m"
    const consolereset = "\x1b[0m"
    console.log(consolered + "Missing 'hosts.json' file from ./bastion/server/config" + consolereset)
  }
  else{
    clusterlist = JSON.parse(data)
    clusterlistkeys = Object.keys(clusterlist)

    // Create JSON in array for ng-Options usable format
    clusterlistkeys.forEach(function(location) {

      // All hosts
      var all = {}
      all.type = location
      all.name = `All Nodes in  ${location}`
      all.value = clusterlist[location].hosts
      iponly.push(all)

      // Each host
      clusterlist[location].hosts.forEach(function(ip) {
        var each = {}
        each.type = location
        each.name = ip
        each.value = [ip]
        iponly.push(each)
      })
    })
  }
})

// Create logs folder if it doesn't exist
if (!fs.existsSync(__dirname + "/logs")){
  fs.mkdirSync(__dirname + "/logs")
}

module.exports = function(app){

  app.get('/hosts', function(req,res){
    res.json(iponly)
  })

  app.post('/deploy', function(req,res){
    // Current date time formatting
    const currdatetime = new Date();
    const thedate = [
      ((currdatetime.getMonth() + 1)<10?'0':'') + (currdatetime.getMonth() + 1),
      (currdatetime.getDate()<10?'0':'') + currdatetime.getDate(),
      currdatetime.getFullYear()
    ].join('-')
    const thetime = [
      (currdatetime.getHours()<10?'0':'') + currdatetime.getHours(),
      (currdatetime.getMinutes()<10?'0':'') + currdatetime.getMinutes(),
      (currdatetime.getSeconds()<10?'0':'') + currdatetime.getSeconds(),
      (currdatetime.getMilliseconds()<10?'0':'') + currdatetime.getMilliseconds()
    ].join('-')
    const timeformat = thedate + "_" + thetime

    // Log directory
    const logdir = __dirname + `/logs/${timeformat}/`

    // Create folder to house script and logs
    fs.mkdirSync(logdir)
    fs.writeFileSync(logdir + "script", req.body.input)

    var locations = req.body.locations

    Object.keys(locations).forEach(function(location){
      if (!("port" in clusterlist[location])) {
        clusterlist[location].port = 22
      }

      locations[location].hosts.forEach(function(host){
        // SSH logic
        let sshargs
        if(req.body.sudo){
          sshargs = ['-p', clusterlist[location].port, `${clusterlist[location].user}@${host}`, 'sudo bash -s']
        }
        else{
          sshargs = ['-p', clusterlist[location].port, `${clusterlist[location].user}@${host}`, 'bash -s']
        }

        const ssh = spawn('ssh', sshargs)

        // Read script file and pass it as stdin
        ssh.stdin.write(fs.readFileSync(logdir + "script", 'utf8'))
        ssh.stdin.end()

        ssh.stderr.on('data', (stderrdata) => {
          fs.appendFileSync(logdir + `${host}.log`, `${stderrdata}`)
        })

        ssh.stdout.on('data', (stdoutdata) => {
          fs.appendFileSync(logdir + `${host}.log`, `${stdoutdata}`)
        })
      })
    })
  })
}
