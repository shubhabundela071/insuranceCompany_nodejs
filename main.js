require('./src/global_constants');
require('./src/global_functions');
//require('./src/socket');

const {
  server,
  io,
  app
} = require('./src/globals');

//knex connection
const Knex = require('knex');
const knexConfig = require('./db/knex');
const v1 = require('./src/routes/index');

const {
  Model
} = require('objection');

// Initialize knex.
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

// CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow

  req.io = io;

  const allowedOrigins = ['http://localhost:4200'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }


  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, authToken');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  // res.setHeader("Access-Control-Expose-Headers", "AuthToken");
  next();
});


// Register our REST API.

// Error handling. The `ValidationError` instances thrown by objection.js have a `statusCode`
// property that is sent as the status code of the response.
//
// NOTE: This is not a good error handler, this is the simplest one. See the error handing
//       recipe for a better handler: http://vincit.github.io/objection.js/#error-handling
app.use('/api', v1);

//error handler
app.use((err, req, res, next) => {
  if (err) {

    res.status(err.statusCode || err.status || 500).send(err || {});

  } else {
    next();
  }
});

// Server listening
server.listen(3000, function () {
  console.log('Insurance Company Server listening on *:', server.address().port);
});