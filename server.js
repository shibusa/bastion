#!/usr/bin/env nodemon
const express = require('express'), path = require('path'), bodyParser = require('body-parser'); fs = require('fs')
const port = 8000;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'client')));

require(path.join(__dirname, 'server/routes.js'))(app)

app.listen(port, function(){
    console.log("Server running on port",port)
});
