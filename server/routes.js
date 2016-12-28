// Asynchronous child_process and file system dependencies
const spawn = require('child_process').spawn, fs = require("fs");

// Parsing hosts.json file in config
const clusterlist = JSON.parse(fs.readFileSync(__dirname + "/config/hosts.json"));
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
    var reqdata = req.body.data

    // Each location
    Object.keys(reqdata).forEach(function(location) {

        // default port if port not listed in hosts.json
        if (!clusterlist[location].port) {
          clusterlist[location].port = 22
        }

        reqdata[location].hosts.forEach(function(host){
          // Current time
          var currdatetime = new Date();

          // Logfile output
          var logfile = __dirname + `/logs/${host.replace(/\./g,'-')}___${currdatetime.toISOString()}.log`

          // SSH format append input to logfile
          const ssh = spawn('ssh', ['-p', clusterlist[location].port, `${clusterlist[location].user}@${host}`, req.body.input]);
          fs.appendFile(logfile, `####Issued Commands\n${req.body.input}\n\n####Output Log\n`, (err) => {
            if (err) throw err;
          });

          // Append outputs to logfiles
          ssh.stdout.on('data', (data) => {
            fs.appendFile(logfile, `${data}`, (err) => {
              if (err) throw err;
            });
          });

          ssh.stderr.on('data', (data) => {
            fs.appendFile(logfile, `${data}`, (err) => {
              if (err) throw err;
            });
          });

          // ssh.on('close', (code) => {
          //   fs.appendFile(logfile, `Exit code: ${code}`, (err) => {
          //     if (err) throw err;
          //   });
          // });
        })
    })
  })
}
