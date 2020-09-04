import {
    LOAD_EMAIL,
    LOAD_SUBPAGE,
    CREATE_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    LOAD_TRANSACTIONS,
} from './Constants';
import { Transaction } from '../types';

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
            await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            dispatch(createTransactionDispatcher(transaction));
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

export const deleteTransactionDispatcher = (id: string): { type: string; id: string } => ({
    type: DELETE_TRANSACTION,
    id: id,
});
export const deleteTransaction = (id: string) => {
    return async (dispatch: any): Promise<any> => {
        try {
            await fetch(`${process.env.BACKEND_URI}/api/transaction/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            dispatch(deleteTransactionDispatcher(id));
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
