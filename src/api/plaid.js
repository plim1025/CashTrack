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
            const { publicToken, batchID, institution, accounts } = req.body;
            const { access_token, item_id } = await plaidClient.exchangePublicToken(publicToken);

            const accountIDs = accounts.map(account => account.id);

            let { accounts: balances } = await plaidClient.getBalance(access_token, {
                account_ids: accountIDs,
            });
            balances = balances.map(account => {
                return {
                    accountID: account.account_id,
                    balance: account.balances.current,
                    available: account.balances.available,
                    creditLimit: account.balances.limit,
                };
            });

            const plaidAccounts = [];
            if (accounts.length) {
                accounts.forEach(account => {
                    const accountBalance = balances.find(
                        balance => balance.accountID === account.id
                    );
                    const newAccount = new PlaidAccount({
                        id: account.id,
                        batchID: batchID,
                        name: account.name,
                        institution: institution,
                        type: account.subtype,
                        mask: account.mask,
                        balance: accountBalance.balance,
                        available: accountBalance.available,
                        creditLimit: accountBalance.creditLimit,
                    });
                    plaidAccounts.push(newAccount);
                });
                await PlaidAccount.insertMany(plaidAccounts);
            }

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
        if (req.user) {
            const { batchID } = req.body;

            const plaidAccountQuery = { batchID: batchID };

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
            const { accessToken, transactions, removedTransactionIDs } = await User.findOne(query);
            const presentDay = getPresentDayFormatted();
            const oldTransactionIDs = transactions.map(transaction => transaction.transactionID);
            const [newTransactions, newInvestmentTransactions] = await Promise.all([
                plaidClient.getAllTransactions(accessToken, '2000-01-01', presentDay),
                plaidClient.getInvestmentTransactions(accessToken, '2000-01-01', presentDay, {
                    count: 500,
                }),
            ]);
            const parsedTransactions = newTransactions.transactions
                .filter(
                    transaction =>
                        oldTransactionIDs.indexOf(transaction.transaction_id) === -1 &&
                        !transaction.pending
                )
                .map(transaction => {
                    return {
                        transactionID: transaction.transaction_id,
                        accountID: transaction.account_id,
                        amount: transaction.amount,
                        category: transaction.category[0],
                        date: transaction.date,
                    };
                });
            const parsedInvestmentTransactions = newInvestmentTransactions.investment_transactions
                .filter(
                    transaction =>
                        oldTransactionIDs.indexOf(transaction.investment_transaction_id) === -1
                )
                .map(transaction => {
                    return {
                        transactionID: transaction.investment_transaction_id,
                        accountID: transaction.account_id,
                        amount: transaction.amount,
                        category: transaction.name,
                        date: transaction.date,
                    };
                });
            const allTransactions = [...parsedTransactions, ...parsedInvestmentTransactions].filter(
                transaction => removedTransactionIDs.indexOf(transaction.transactionID) === -1
            );
            const update = { $push: { transactions: { $each: allTransactions } } };
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

// router.post('/test', async (req, res) => {
//     const { transactions } = await User.findById({ _id: req.user._id });
//     console.log(
//         transactions.filter(
//             transaction => transaction.accountID === 'Ajkj4wekEMin7wVEzRAyCmPaBzwQn4f1QRGaZ'
//         )
//     );
//     res.sendStatus(200);
// });

module.exports = router;
