const express = require('express'),
  // morgan = require('morgan'),
  // fs = require('fs'),
  // path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  Models = require('./models');
const { check, validationResult } = require('express-validator');


const app = express();

let allowedOrigins = ['http://localhost:8080', 'https://cezarszlmyflix-0212aa467a8d.herokuapp.com/'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

const Movies = Models.Movie;
const Users = Models.User;

// Local DB
mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB');

// Atlas online DB
// mongoose.connect(process.env.CONNECTION_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./auth')(app);
const passport = require('passport');
require('./passport');

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// app.use(morgan(':method :url :date[web]', { stream: accessLogStream }))

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a Movie by Title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send('There is no such a movie')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get Genre by its Name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send('There is no such a genre')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get Director by Name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send('There is no such a director')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

const UsersValidationMethods = [
  check('Username', 'Username is required (minimum 10 characters)').isLength({ min: 10 }),
  check('Username', 'Name contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is  required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
]

// Post New User
app.post('/users', UsersValidationMethods, async (req, res) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ "Username": req.body.Username })
    .then((user) => {
      if (user) {
        res.status(400).send(req.body.Username + ' already exist!')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user) })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update Users Name
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), UsersValidationMethods, async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Post a movie to the list of favourites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $push: { FavouriteMovies: req.params.MovieID }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        Movies.findById(req.params.MovieID)
          .then((movie) => {
            res.status(200).send(movie.Title + " has been added to " + updatedUser.Username + "\'s favourites films.");
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('There is no such a movie (wrong ID)');
          });
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Delete a movie from the list of favourites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $pull: { FavouriteMovies: req.params.MovieID }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        Movies.findById(req.params.MovieID)
          .then((movie) => {
            res.status(200).send(movie.Title + " has been removed from " + updatedUser.Username + "\'s favourites films.");
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('There is no such a movie (wrong ID)');
          });
      } else {
        res.status(500).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('There is no such a movie (wrong ID)');
    })
});

// Delete an user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        res.status(200).send(req.params.Username + ' has been deleted.');
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


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