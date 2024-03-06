const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for users.
 * @const {Schema}
 */
let userSchema = mongoose.Schema({
    /**
     * Username of the user.
     * @type {string}
     * @required
     */
    Username: { type: String, required: true },
    /**
     * Password of the user.
     * @type {string}
     * @required
     */
    Password: { type: String, required: true },
    /**
     * Email of the user.
     * @type {string}
     * @required
     */
    Email: { type: String, required: true },
    /**
     * Birthday of the user.
     * @type {Date}
     */
    Birthday: Date,
    /**
     * List of favorite movies for the user.
     * @type {Array.<mongoose.Schema.Types.ObjectId>}
     */
    FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes the provided password using bcrypt.
 * @function
 * @static
 * @param {string} password - Plain text password.
 * @returns {string} - Hashed password.
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validates the provided password against the stored hashed password.
 * @function
 * @memberof module:models/user~User
 * @param {string} password - Plain text password.
 * @returns {boolean} - Indicates whether the provided password is valid.
 */
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

/**
 * Mongoose model for users.
 * @const {Model}
 */
let User = mongoose.model('User', userSchema);

module.exports.User = User;
