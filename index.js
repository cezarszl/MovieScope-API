const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
require('dotenv').config();

/**
 * List of allowed origins for CORS.
 * @type {string[]}
 */
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://cezarszl.netlify.app/', 'https://cezarszl.github.io/myFlix-Angular-client/'];

/**
 * Middleware for CORS handling.
 */
app.use(cors());

/**
 * Function to connect to MongoDB database.
 * @type {function}
 */
const mongooseConnectDB = require("./configs/mongoose.db");

mongooseConnectDB(process.env.CONNECTION_URI);

/**
 * Middleware for parsing JSON requests.
 */
app.use(bodyParser.json());

/**
 * Middleware for parsing URL-encoded requests.
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routes for authentication.
 */
require('./routes/auth')(app);

/**
 * Default routes.
 */
app.use(require('./routes/routes'));

/**
 * Middleware for serving static files.
 */
app.use(express.static('public'));

/**
 * Error handling middleware.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is broken');
});

/**
 * Port for the server to listen on.
 * @const {number}
 */
const port = process.env.PORT || 8080;

/**
 * Host address for the server to listen on.
 * @const {string}
 */
const host = '0.0.0.0';

/**
 * Starts the server.
 */
app.listen(port, host, () => {
  console.log('Your app is listening on port ' + port + '.');
});
