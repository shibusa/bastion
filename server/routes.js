// Asynchronous child_process and file system dependencies
const spawn = require('child_process').spawn, fs = require("fs")

// Parsing hosts.json file in config
const clusterlist = JSON.parse(fs.readFileSync(__dirname + "/config/hosts.json"))
const clusterlistkeys = Object.keys(clusterlist)

// Create JSON in array for ng-Options usable format
var iponly = []
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
        console.log(logdir + "script")
        ssh.stdin.write(fs.readFileSync(logdir + "script", 'utf8'))
        ssh.stdin.end()

        console.log("file pushed to stdin")
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
