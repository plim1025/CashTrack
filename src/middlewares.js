const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
    });
};

const initializePassport = passport => {
    const authenticateUser = async (email, password, done) => {
        const currentUser = await User.findOne({ email: email });
        if (currentUser == null) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, currentUser.password)) {
                return done(null, currentUser);
            }
            return done(null, false, { message: 'Password incorrect' });
        } catch (error) {
            return done(error);
        }
    };
    passport.use(new Strategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const currentUser = await User.findOne({ _id: id });
        return done(null, currentUser);
    });
};

module.exports = {
    notFound,
    errorHandler,
    initializePassport,
};
