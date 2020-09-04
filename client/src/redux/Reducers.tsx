import {
    LOAD_EMAIL,
    LOAD_SUBPAGE,
    CREATE_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    LOAD_TRANSACTIONS,
} from './Constants';
import { combineReducers } from 'redux';
import { Transaction } from '../types';

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
    state: Transaction[] = [],
    action: { type: string; id?: string; transaction?: Transaction; transactions?: Transaction[] }
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
        case DELETE_TRANSACTION:
            return state.filter(transaction => transaction._id === action.id);
        case LOAD_TRANSACTIONS:
            return action.transactions;
        default:
            return state;
    }
};

export default combineReducers({
    email,
    subpage,
    transactions,
});
