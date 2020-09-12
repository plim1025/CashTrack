const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const userRoute = require('./api/user');
const categoryRoute = require('./api/category');
const transactionRoute = require('./api/transaction');
const plaidAccountRoute = require('./api/plaidAccount');
const plaidRoute = require('./api/plaid');

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
app.use(helmet());
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2592000000, // 30 days in ms
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', (req, res, next) => {});

app.use('/api/user', userRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/category', categoryRoute);
app.use('/api/plaidAccount', plaidAccountRoute);
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
