/**
 * Express Router Configuration
 * Defines routes for accessing movies and users data.
 * @module routes
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
ModelMovie = require('../models/movie');
ModelUser = require('../models/user');

const Movies = ModelMovie.Movie;
const Users = ModelUser.User;

const auth = require('./auth');

/**
 * Welcome message endpoint.
 * @name GET /
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.get('/', (req, res) => {
    res.send('Welcome to myFLixAPI');
});

// Get all movies
/**
 * Get all movies endpoint.
 * @name GET /movies
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
/**
 * Get a movie by title endpoint.
 * @name GET /movies/:title
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
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
/**
 * Get a genre by its name endpoint.
 * @name GET /movies/genres/:genreName
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
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
/**
 * Get a director by name endpoint.
 * @name GET /movies/directors/:directorName
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
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
    check('Email', 'Email does not appear to be valid').isEmail()
];

// Post New User
/**
 * Create a new user endpoint.
 * @name POST /users
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.post('/users', UsersValidationMethods, async (req, res) => {
    // Function code here
});

// Update Users Name
/**
 * Update a user's name endpoint.
 * @name PUT /users/:Username
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.put('/users/:Username', passport.authenticate('jwt', { session: false }), UsersValidationMethods, async (req, res) => {
    // Function code here
});

// Post a movie to the list of favourites
/**
 * Add a movie to the list of favorites endpoint.
 * @name POST /users/:Username/movies/:MovieID
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Function code here
});

// Delete a movie from the list of favourites
/**
 * Remove a movie from the list of favorites endpoint.
 * @name DELETE /users/:Username/movies/:MovieID
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Function code here
});

// Delete an user
/**
 * Delete a user endpoint.
 * @name DELETE /users/:Username
 * @function
 * @memberof module:routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
router.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Function code here
});

module.exports = router;

/**
 * Express router instance.
 * @name router
 * @type {object}
 * @memberof module:routes
 */
