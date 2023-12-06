const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
ModelMovie = require('../models/movie');
ModelUser = require('../models/user');

const Movies = ModelMovie.Movie;
const Users = ModelUser.User;

const auth = require('./auth');

router.get('/', (req, res) => {
    res.send('Welcome to myFLixAPI');
});

// Get all movies
router.get('/movies', /* passport.authenticate('jwt'  { session: false }), */ async (req, res) => {
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
router.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
    check('Email', 'Email does not routerear to be valid').isEmail()
];

// Post New User
router.post('/users', UsersValidationMethods, async (req, res) => {

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
router.put('/users/:Username', passport.authenticate('jwt', { session: false }), UsersValidationMethods, async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate({ "Username": req.params.Username },
        {
            $set: {
                Username: req.body.Username,
                Password: hashedPassword,
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
router.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    const movie = await Movies.findById(req.params.MovieID);
    if (!movie) {
        return res.status(400).send('The movie doesnt exist');
    }
    const updatedUser = await Users.findOneAndUpdate({ "Username": req.params.Username },
        {
            $addToSet: { FavouriteMovies: req.params.MovieID }
        }, { new: true });

    if (!updatedUser) {
        return res.status(400).send('There is no such an user');
    }
    res.json(updatedUser);
});


// Delete a movie from the list of favourites
router.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

module.exports = router;
