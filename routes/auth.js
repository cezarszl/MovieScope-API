const jwtSecret = 'secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../middlewares/passport');

let issueJWT = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '2d',
        algorithm: 'HS256'
    });
}
module.exports = (router) => {
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
