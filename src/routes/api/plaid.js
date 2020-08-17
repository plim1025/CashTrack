const { Router } = require('express');
const plaid = require('plaid');
// const User = require('../../models/User');
require('dotenv').config();

const router = Router();

const plaidClient = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env:
        process.env.NODE_ENV === 'production'
            ? plaid.environments.development
            : plaid.environments.sandbox,
    options: {
        version: '2019-05-29',
    },
});

router.post('/create_link_token', async (req, res, next) => {
    try {
        // const userID = req.user._id;
        const userID = '5o4efdasfdasraf';
        const { link_token } = await plaidClient.createLinkToken({
            user: { client_user_id: userID },
            client_name: 'CashTrack',
            products: process.env.PLAID_PRODUCTS.split(' '),
            country_codes: process.env.PLAID_COUNTRY_CODES.split(' '),
            language: 'en',
            // redirect_uri: '',
        });
        res.json(link_token);
    } catch (error) {
        next(error);
    }
});

router.post('/set_access_token', async (req, res, next) => {
    try {
        const { publicToken } = req.body;
        await plaidClient.exchangePublicToken(publicToken);
        process.env.PLAID_ACCESS_TOKEN = res.access_token;
        process.env.PLAID_ITEM_ID = res.item_id;
        res.status(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
