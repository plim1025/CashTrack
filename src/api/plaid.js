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

const getTransactionCategory = categories => {
    const firstCategory = categories[0];
    const secondCategory = categories[1];
    const thirdCategory = categories[2];
    if (
        firstCategory === 'Community' ||
        firstCategory === 'Payment' ||
        firstCategory === 'Service' ||
        firstCategory === 'Shops' ||
        firstCategory === 'Transfer'
    ) {
        if (secondCategory) {
            if (
                (secondCategory === 'Financial' || secondCategory === 'Third Party') &&
                thirdCategory
            ) {
                return thirdCategory;
            }
            return secondCategory;
        }
    }
    return firstCategory;
};

const plaidClient = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.development,
    // process.env.NODE_ENV === 'production'
    //     ? plaid.environments.development
    //     : plaid.environments.sandbox,
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
                webhook: process.env.PLAID_WEBHOOK_URI,
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
            const { publicToken, batchID, institution, accounts: newAccounts } = req.body;
            const { access_token, item_id } = await plaidClient.exchangePublicToken(publicToken);
            let newAccountIDs = newAccounts.map(account => account.id);

            const { accountIDs: oldAccountIDs } = await User.findById(req.user._id);
            const plaidAccountQuery = { id: { $in: oldAccountIDs } };
            const oldAccounts = await PlaidAccount.find(plaidAccountQuery);

            let { accounts: balances } = await plaidClient.getBalance(access_token, {
                account_ids: newAccountIDs,
            });
            balances = balances.map(account => {
                return {
                    accountID: account.account_id,
                    balance: account.balances.current,
                    available: account.balances.available,
                    creditLimit: account.balances.limit,
                };
            });

            let duplicateAccount = false;
            let oldBatchID;
            newAccounts.forEach(newAccount => {
                oldAccounts.forEach(oldAccount => {
                    if (
                        newAccount.name === oldAccount.name &&
                        institution === oldAccount.institution &&
                        newAccount.mask === oldAccount.mask
                    ) {
                        duplicateAccount = true;
                        oldBatchID = oldAccount.batchID;
                        newAccountIDs = newAccountIDs.filter(
                            accountID => accountID !== newAccount.id
                        );
                    }
                });
            });

            const plaidAccounts = [];
            newAccounts.forEach(account => {
                if (newAccountIDs.includes(account.id)) {
                    const accountBalance = balances.find(
                        balance => balance.accountID === account.id
                    );
                    const newPlaidAccount = new PlaidAccount({
                        id: account.id,
                        batchID: duplicateAccount ? oldBatchID : batchID,
                        name: account.name,
                        institution: institution,
                        type: account.type,
                        mask: account.mask,
                        balance: accountBalance.balance,
                        available: accountBalance.available,
                        creditLimit: accountBalance.creditLimit,
                    });
                    plaidAccounts.push(newPlaidAccount);
                }
            });
            await PlaidAccount.insertMany(plaidAccounts);

            const query = { _id: req.user._id };
            const update = {
                $set: { accessToken: access_token, itemID: item_id },
                $push: {
                    accountIDs: { $each: newAccountIDs },
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
            const newTransactions = await plaidClient.getAllTransactions(
                accessToken,
                '2000-01-01',
                presentDay
            );
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
                        categoryID: transaction.category_id,
                        description: transaction.name,
                        amount: transaction.amount,
                        category: getTransactionCategory(transaction.category),
                        merchant: transaction.merchant_name,
                        date: transaction.date,
                    };
                })
                .filter(
                    transaction => removedTransactionIDs.indexOf(transaction.transactionID) === -1
                );
            const update = { $push: { transactions: { $each: parsedTransactions } } };
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
