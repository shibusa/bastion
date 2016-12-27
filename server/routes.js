// Asynchronous child_process and file system dependencies
const spawn = require('child_process').spawn, fs = require("fs");

// Parsing hosts.json file in config
const clusterlist = JSON.parse(fs.readFileSync(__dirname + "/config/hosts.json"));
const clusterlistkeys = Object.keys(clusterlist)

// // Create JSON in array for ng-Options usable format
// var iponly = []
// clusterlistkeys.forEach(function(location) {
//   console.log(location)
//   clusterlist[location]["hosts"].forEach(function(ip) {
//     var dict = {}
//     dict.type = location
//     dict.value = ip
//     iponly.push(dict)
//   })
// })

// Create JSON in object for ng-Options usable format
var iponly = {}
clusterlistkeys.forEach(function(location){
  iponly[location] = clusterlist[location]["hosts"]
})

console.log(iponly)

module.exports = function(app){

  app.get('/hosts', function(req,res){
    res.json(iponly)
  })

  app.post('/deploy', function(req,res){
    req.body.hosts.forEach(function(host) {
      // Response for hosts is sent back as "LOCATION IP", need to break into an array to run through hosts.json
      const reqsplit = host.split(",")

      // default port if port not listed in hosts.json
      if (!clusterlist[reqsplit[0]].port) {
        clusterlist[reqsplit[0]].port = 22
      }

      // // IF PASTE
      // const ssh = spawn('ssh', ['-p', clusterlist[host].port, `${clusterlist[host].user}@${host}`, req.body.input]);
      // // IF UPLOAD
      //
      // ssh.stdout.on('data', (data) => {
      //   // console.log(`\x1b[36m${host} output:\x1b[30m`);
      //   console.log(`${data}`);
      // });
      //
      // ssh.stderr.on('data', (data) => {
      //   console.log(`\x1b[36m${host} error:\x1b[30m`);
      //   console.log(`${data}`);
      // });
      //
      // // ssh.on('close', (code) => {
      // //   console.log(`\x1b[36m${host} exit:\x1b[30m`);
      // //   console.log(`Code ${code}`);
      // // });
    })
  })
}
