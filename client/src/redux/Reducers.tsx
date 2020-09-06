import {
    LOAD_EMAIL,
    LOAD_SUBPAGE,
    CREATE_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTIONS,
    LOAD_TRANSACTIONS,
    LOAD_ACCOUNTS,
} from './Constants';
import { combineReducers } from 'redux';
import { Transaction, Account } from '../types';

const email = (state = '', action: { type: string; email?: string }): any => {
    switch (action.type) {
        case LOAD_EMAIL:
            return action.email;
        default:
            return state;
    }
};

const subpage = (state = 'home', action: { type: string; subpage?: string }): any => {
    switch (action.type) {
        case LOAD_SUBPAGE:
            return action.subpage;
        default:
            return state;
    }
};

const transactions = (
    state: Transaction[] = null,
    action: {
        type: string;
        id?: string;
        transaction?: Transaction;
        transactions?: Transaction[];
        transactionIDs?: string[];
    }
): any => {
    switch (action.type) {
        case CREATE_TRANSACTION:
            return [...state, action.transaction];
        case UPDATE_TRANSACTION:
            const filteredTransactions = state.filter(
                transaction => transaction.transactionID !== action.id
            );
            const updatedTransactions = [...filteredTransactions, action.transaction];
            return updatedTransactions;
        case DELETE_TRANSACTIONS:
            return state.filter(
                transaction => action.transactionIDs.indexOf(transaction._id) === -1
            );
        case LOAD_TRANSACTIONS:
            return action.transactions;
        default:
            return state;
    }
};

const accounts = (state: Account[] = null, action: { type: string; accounts: Account[] }): any => {
    switch (action.type) {
        case LOAD_ACCOUNTS:
            return action.accounts;
        default:
            return state;
    }
};

export default combineReducers({
    email,
    subpage,
    transactions,
    accounts,
});
