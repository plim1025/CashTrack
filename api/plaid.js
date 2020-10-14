const { Router } = require('express');
const plaid = require('plaid');
const User = require('../models/User');
const PlaidAccount = require('../models/PlaidAccount');
const Transaction = require('../models/Transaction');
const { getPresentDayFormatted, getTransactionCategory, getTransactionType } = require('./utils');
require('dotenv').config();

const router = Router();

const plaidClient = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.sandbox,
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
            throw Error('User not logged in');
        }
    } catch (error) {
        next(error);
    }
});

const updateTransactions = async item_id => {
    const userQuery = { itemID: item_id };
    const { accessToken, removedTransactionIDs, _id } = await User.findOne(userQuery);
    const transactionQuery = { userID: _id };
    const oldTransactions = await Transaction.find(transactionQuery);
    const oldTransactionIDs = oldTransactions.map(transaction => transaction.transactionID);
    const newTransactions = await plaidClient.getAllTransactions(
        accessToken,
        '2000-01-01',
        getPresentDayFormatted()
    );
    const updatedAccountIDs = [];
    const parsedTransactions = newTransactions.transactions
        .filter(
            transaction =>
                oldTransactionIDs.indexOf(transaction.transaction_id) === -1 &&
                removedTransactionIDs.indexOf(transaction.transactionID) === -1 &&
                !transaction.pending
        )
        .map(transaction => {
            updatedAccountIDs.push(transaction.account_id);
            return new Transaction({
                userID: _id,
                transactionID: transaction.transaction_id,
                accountID: transaction.account_id,
                categoryID: transaction.category_id,
                description: transaction.name,
                amount: transaction.amount * -1,
                category: getTransactionCategory(transaction.category_id, transaction.amount),
                merchant: transaction.merchant_name,
                type: getTransactionType(transaction.category_id, transaction.amount),
                date: transaction.date,
                selected: true,
            });
        });
    await Transaction.insertMany(parsedTransactions);
    const accountQuery = { id: { $in: updatedAccountIDs } };
    const accountUpdate = { lastUpdated: new Date() };
    await PlaidAccount.updateMany(accountQuery, accountUpdate);
};

router.post('/set_account', async (req, res, next) => {
    try {
        if (req.user) {
            const { publicToken, batchID, institution, accounts } = req.body;
            const { access_token, item_id } = await plaidClient.exchangePublicToken(publicToken);
            let newAccountIDs = accounts.map(account => account.id);
            const plaidAccountQuery = { userID: req.user._id };
            const oldAccounts = await PlaidAccount.find(plaidAccountQuery);
            let { accounts: balances } = await plaidClient.getBalance(access_token, {
                account_ids: newAccountIDs,
            });
            balances = balances.map(account => {
                return {
                    accountID: account.account_id,
                    available: account.balances.available,
                    creditLimit: account.balances.limit,
                };
            });

            let duplicateAccount = false;
            let oldBatchID;
            accounts.forEach(newAccount => {
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
            accounts.forEach(account => {
                if (newAccountIDs.includes(account.id)) {
                    const accountBalance = balances.find(
                        balance => balance.accountID === account.id
                    );
                    const newPlaidAccount = new PlaidAccount({
                        id: account.id,
                        userID: req.user._id,
                        batchID: duplicateAccount ? oldBatchID : batchID,
                        name: account.name,
                        institution: institution,
                        type: account.type,
                        subtype: account.subtype,
                        mask: account.mask,
                        available: accountBalance.available,
                        creditLimit: accountBalance.creditLimit,
                        lastUpdated: new Date(),
                    });
                    plaidAccounts.push(newPlaidAccount);
                }
            });
            await PlaidAccount.insertMany(plaidAccounts);

            const query = { _id: req.user._id };
            const update = { $set: { accessToken: access_token, itemID: item_id } };
            await User.updateOne(query, update, { runValidators: true });
            await updateTransactions(item_id);
            res.sendStatus(200);
        } else {
            throw Error('User not logged in');
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
            const query = { transactionID: { $in: removed_transactions } };
            await Transaction.deleteMany(query);
        } else if (
            (webhook_code === 'INITIAL_UPDATE' ||
                webhook_code === 'HISTORICAL_UPDATE' ||
                webhook_code === 'DEFAULT_UPDATE') &&
            new_transactions > 0
        ) {
            await updateTransactions(item_id);
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
