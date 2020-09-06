import {
    LOAD_EMAIL,
    LOAD_SUBPAGE,
    CREATE_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTIONS,
    LOAD_TRANSACTIONS,
    LOAD_ACCOUNTS,
} from './Constants';
import { Transaction, Account } from '../types';

export const loadEmail = (email: string): { type: string; email: string } => ({
    type: LOAD_EMAIL,
    email: email,
});

export const loadSubpage = (subpage: string): { type: string; subpage: string } => ({
    type: LOAD_SUBPAGE,
    subpage: subpage,
});

export const createTransactionDispatcher = (
    transaction: Transaction
): { type: string; transaction: Transaction } => ({
    type: CREATE_TRANSACTION,
    transaction: transaction,
});
export const createTransaction = (transaction: Transaction) => {
    return async (dispatch: any): Promise<any> => {
        try {
            const transactionInfo = JSON.stringify({
                description: transaction.description,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
            });
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            const id = await response.json();
            const transactionWithID = { ...transaction, _id: id };
            dispatch(createTransactionDispatcher(transactionWithID));
        } catch (error) {
            console.log(`Error creating transaction: ${error}`);
        }
    };
};

export const updateTransactionDispatcher = (
    id: string,
    transaction: Transaction
): { type: string; id: string; transaction: Transaction } => ({
    type: UPDATE_TRANSACTION,
    id: id,
    transaction: transaction,
});
export const updateTransaction = (id: string, transaction: Transaction) => {
    return async (dispatch: any): Promise<any> => {
        try {
            const transactionInfo = JSON.stringify({
                description: transaction.description,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
            });
            await fetch(`${process.env.BACKEND_URI}/api/transaction/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            dispatch(updateTransactionDispatcher(id, transaction));
        } catch (error) {
            console.log(`Error updating transaction: ${error}`);
        }
    };
};

export const deleteTransactionsDispatcher = (
    ids: string[]
): { type: string; transactionIDs: string[] } => ({
    type: DELETE_TRANSACTIONS,
    transactionIDs: ids,
});
export const deleteTransactions = (ids: string[]) => {
    return async (dispatch: any): Promise<any> => {
        try {
            const transactionInfo = JSON.stringify(ids);
            await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            dispatch(deleteTransactionsDispatcher(ids));
        } catch (error) {
            console.log(`Error deleting transaction: ${error}`);
        }
    };
};

export const loadTransactions = (
    transactions: Transaction[]
): { type: string; transactions: Transaction[] } => ({
    type: LOAD_TRANSACTIONS,
    transactions: transactions,
});

export const loadAccounts = (accounts: Account[]): { type: string; accounts: Account[] } => ({
    type: LOAD_ACCOUNTS,
    accounts: accounts,
});

export const logout = (history: any) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        try {
            await fetch(`${process.env.BACKEND_URI}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.log(`Error logging out: ${error}`);
        }
        if (getState().email) {
            dispatch(loadEmail(''));
        }
        if (sessionStorage.getItem('email')) {
            sessionStorage.setItem('email', '');
        }
        dispatch(loadSubpage('home'));
        history.push('/signin');
    };
};
