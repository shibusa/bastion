#!/usr/bin/env nodemon
const express = require('express'), path = require('path'), bodyParser = require('body-parser'), fs = require('fs'), https = require('https');
const port = 8000;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'client')));

require(path.join(__dirname, 'server/routes.js'))(app);

function searchfor (string, array){
  for (item in array){
    if (array[item].search(string) != -1 ) {
      return array[item]
    }
  }
}

https.createServer({
  key: fs.readFileSync(searchfor("-key.pem", fs.readdirSync("./"))),
  cert: fs.readFileSync(searchfor("-cert.pem", fs.readdirSync("./")))
}, app).listen(port, function(){
    console.log("https on",port)
});
