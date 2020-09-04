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

export const createTransaction = (
    transaction: Transaction
): { type: string; transaction: Transaction } => ({
    type: CREATE_TRANSACTION,
    transaction: transaction,
});

export const updateTransaction = (
    id: string,
    transaction: Transaction
): { type: string; id: string; transaction: Transaction } => ({
    type: UPDATE_TRANSACTION,
    id: id,
    transaction: transaction,
});

export const deleteTransaction = (id: string): { type: string; id: string } => ({
    type: DELETE_TRANSACTION,
    id: id,
});

export const loadTransactions = (
    transactions: Transaction[]
): { type: string; transactions: Transaction[] } => ({
    type: LOAD_TRANSACTIONS,
    transactions: transactions,
});
