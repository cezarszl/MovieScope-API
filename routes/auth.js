/**
 * JWT secret key for token encryption.
 * @constant {string}
 */
const jwtSecret = 'secret';

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Passport middleware configuration
require('../middlewares/passport');

/**
 * Generates a JWT token for a user.
 * @function
 * @param {Object} user - User object.
 * @returns {string} - JWT token.
 */
let issueJWT = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '2d',
        algorithm: 'HS256'
    });
}

/**
 * Authenticates a user and issues a JWT token upon successful login.
 * @param {Object} router - Express router instance.
 */
module.exports = (router) => {
    /**
     * Route serving POST requests to log in a user.
     * @name post/login
     * @function
     * @memberof module:routes/auth
     * @inner
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    const loginEP = router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is wrong',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = issueJWT(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}
