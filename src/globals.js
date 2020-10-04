
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const promiseRouter = require('express-promise-router');
const router = promiseRouter();
const cors = require('cors');
var fs = require('fs');
const http = require('http');

//Express connection.
const app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .use(router)
  .use(cors({
    credentials: true,
    origin: (origin, callback) => callback(null, true),
  }))

app.use(express.static('public'));

//Socket connection.
var server = http.createServer(app);
var io = require('socket.io')(server);

module.exports = {
  server,
  io,
  app
};

