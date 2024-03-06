const mongoose = require('mongoose');

/**
 * Mongoose schema for movies.
 * @const {Schema}
 */
let movieSchema = mongoose.Schema({
    /**
     * Title of the movie.
     * @type {string}
     * @required
     */
    Title: { type: String, required: true },
    /**
     * Description of the movie.
     * @type {string}
     * @required
     */
    Description: { type: String, required: true },
    /**
     * Genre information of the movie.
     * @type {Object}
     */
    Genre: {
        /**
         * Name of the genre.
         * @type {string}
         */
        Name: String,
        /**
         * Description of the genre.
         * @type {string}
         */
        Description: String
    },
    /**
     * Director information of the movie.
     * @type {Object}
     */
    Director: {
        /**
         * Name of the director.
         * @type {string}
         */
        Name: String,
        /**
         * Bio of the director.
         * @type {string}
         */
        Bio: String
    },
    /**
     * Image path of the movie.
     * @type {string}
     */
    ImagePath: String,
    /**
     * Indicates if the movie is featured.
     * @type {boolean}
     */
    Featured: Boolean,
    /**
     * Release date of the movie.
     * @type {Date}
     */
    ReleaseDate: Date,
    /**
     * Rating of the movie.
     * @type {number}
     */
    Rating: Number
});

/**
 * Mongoose model for movies.
 * @const {Model}
 */
let Movie = mongoose.model('Movie', movieSchema);

module.exports.Movie = Movie;
