const cors = require('cors');
const express = require('express');
const flash = require('express-flash');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const userRoute = require('./routes/api/user');
const transactionRoute = require('./routes/api/transaction');
const plaidRoute = require('./routes/api/plaid');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection
    .once('open', () => console.log('Connection has been made with mongoDB'))
    .on('error', e => console.log(`Connection error with mongoDB: ${e}`));

middlewares.initializePassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URI,
    })
);
app.use(flash());
app.use(helmet());
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
    try {
        // res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
        res.json({ message: req.user });
    } catch (error) {
        next();
    }
});

app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/api/user', userRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/plaid', plaidRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at PORT ${port}`));
