const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors');

const app = express();
require('dotenv').config();
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://cezarszl.netlify.app/', 'https://cezarszl.github.io/myFlix-Angular-client/'];
app.use(cors());

const mongooseConnectDB = require("./configs/mongoose.db");

mongooseConnectDB(process.env.CONNECTION_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/auth')(app);
app.use(require('./routes/routes'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is broken');
});

const port = process.env.PORT || 8080;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log('Your app is listening on port ' + port + '.');
});