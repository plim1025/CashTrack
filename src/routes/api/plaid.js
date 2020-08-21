const { Router } = require('express');
const plaid = require('plaid');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
require('dotenv').config();

const router = Router();

const getPresentDayFormatted = () => {
    const d = new Date();
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
};

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
        if (req.user) {
            const { link_token } = await plaidClient.createLinkToken({
                user: { client_user_id: req.user._id },
                client_name: 'CashTrack',
                products: process.env.PLAID_PRODUCTS.split(' '),
                country_codes: process.env.PLAID_COUNTRY_CODES.split(' '),
                language: 'en',
                // redirect_uri: '',
            });
            res.json(link_token);
        } else {
            console.log('Error creating link token, user not logged in.');
            throw Error;
        }
    } catch (error) {
        next(error);
    }
});

router.post('/set_account', async (req, res, next) => {
    try {
        if (req.user) {
            const { publicToken, institution, accounts } = req.body;
            const { access_token, item_id } = await plaidClient.exchangePublicToken(publicToken);

            const allTransactions = [];
            await Promise.all(
                accounts.map(async account => {
                    const { transactions } = await plaidClient.getTransactions(
                        access_token,
                        '2000-01-01',
                        getPresentDayFormatted(),
                        {
                            account_ids: [account.id],
                            count: 500,
                        }
                    );
                    await Promise.all(
                        transactions.map(async transaction => {
                            if (!transaction.pending) {
                                const newTransaction = new Transaction({
                                    accountType: account.subtype,
                                    amount: transaction.amount,
                                    category: transaction.category[0],
                                    date: transaction.date,
                                });
                                await newTransaction.save();
                                allTransactions.push(newTransaction);
                            }
                        })
                    );
                })
            );

            const query = { _id: req.user._id };
            const update = {
                $set: { accessToken: access_token, itemID: item_id, institution: institution },
                $push: { transactions: { $each: allTransactions } },
            };
            await User.updateOne(query, update);

            res.sendStatus(200);
        } else {
            console.log('Error setting account, user not logged in.');
            throw Error;
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;
