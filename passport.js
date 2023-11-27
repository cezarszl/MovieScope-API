const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

let Users = Models.User;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        async (username, password, done) => {
            console.log(`Value of "User" in authUser function ----> ${username}`);
            console.log(`Value of "Password" in authUser function ----> ${password}`);
            return await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        console.log('Incorrect username');
                        return done(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, { message: 'Incorrect password.' });
                    }
                    console.log('Finished');
                    return done(null, user);
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        return done(error);
                    }
                })

        })
);


const JWTOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
}

passport.use(new JWTStrategy(JWTOptions, async (jwt_payload, done) => {
    await Users.findById(jwt_payload._id)
        .then((user) => {
            return done(null, user);
        })
        .catch((error) => {
            return (done(error));
        });

}));
