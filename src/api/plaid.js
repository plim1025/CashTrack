const { Router } = require('express');
const plaid = require('plaid');
const User = require('../models/User');
const PlaidAccount = require('../models/PlaidAccount');
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
                webhook: process.env.WEBHOOK_URI,
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
            const { publicToken, institution, institutionID, accounts } = req.body;
            const { access_token, item_id } = await plaidClient.exchangePublicToken(publicToken);

            const accountIDs = accounts.map(account => account.id);

            let { accounts: balances } = await plaidClient.getBalance(access_token, {
                account_ids: accountIDs,
            });
            balances = balances.map(account => {
                return {
                    accountID: account.account_id,
                    balance: account.balances.current,
                };
            });

            const plaidAccounts = [];
            if (accounts.length) {
                accounts.forEach(account => {
                    const newAccount = new PlaidAccount({
                        id: account.id,
                        name: account.name,
                        institution: institution,
                        institutionID: institutionID,
                        type: account.subtype,
                        mask: account.mask,
                        balance: balances.filter(balance => balance.accountID === account.id)[0]
                            .balance,
                    });
                    plaidAccounts.push(newAccount);
                });
            }
            await PlaidAccount.insertMany(plaidAccounts);

            const query = { _id: req.user._id };
            const update = {
                $set: { accessToken: access_token, itemID: item_id },
                $push: {
                    accountIDs: { $each: accountIDs },
                },
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

router.post('/logout', async (req, res, next) => {
    try {
        const { institutionID } = req.body;

        const plaidAccountQuery = { institutionID: institutionID };

        const deletedPlaidAccounts = await PlaidAccount.find(plaidAccountQuery);
        await PlaidAccount.deleteMany(plaidAccountQuery);
        const deletedPlaidAccountIDs = deletedPlaidAccounts.map(account => account.id);

        const userUpdate = {
            $pull: {
                transactions: { accountID: { $in: deletedPlaidAccountIDs } },
                accountIDs: { $in: deletedPlaidAccountIDs },
            },
        };
        await User.updateMany({}, userUpdate);
        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const { webhook_code, item_id, error, new_transactions, removed_transactions } = req.body;
        if (error) {
            throw error;
        }
        if (webhook_code === 'TRANSACTIONS_REMOVED') {
            const update = {
                $pull: { transactions: { transactionID: { $in: removed_transactions } } },
            };
            await User.updateMany({}, update);
        } else if (
            (webhook_code === 'INITIAL_UPDATE' ||
                webhook_code === 'HISTORICAL_UPDATE' ||
                webhook_code === 'DEFAULT_UPDATE') &&
            new_transactions > 0
        ) {
            const query = { itemID: item_id };
            const { accessToken, transactions } = await User.findOne(query);
            const oldTransactionIDs = transactions.map(transaction => transaction.transactionID);
            let { transactions: newTransactions } = await plaidClient.getTransactions(
                accessToken,
                '2000-01-01',
                getPresentDayFormatted(),
                {
                    count: 500,
                }
            );
            newTransactions = newTransactions
                .filter(transaction => oldTransactionIDs.indexOf(transaction.transaction_id) === -1)
                .filter(transaction => !transaction.pending)
                .map(transaction => {
                    return {
                        transactionID: transaction.transaction_id,
                        accountID: transaction.account_id,
                        amount: transaction.amount,
                        category: transaction.category[0],
                        date: transaction.date,
                    };
                });
            const update = { $push: { transactions: { $each: newTransactions } } };
            await User.updateOne(query, update);
        }
        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;
