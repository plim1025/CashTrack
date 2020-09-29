// TYPES //
import { User, Transaction, Account, Category, Budget } from '../../types';

export const fetchUser = async (): Promise<User> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/user`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching user: ${error}`);
    }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching transactions: ${error}`);
    }
};

export const fetchAccounts = async (): Promise<Account[]> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching accounts: ${error}`);
    }
};

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/category`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching categories: ${error}`);
    }
};

export const fetchBudgets = async (): Promise<Budget[]> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/budget`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching budgets: ${error}`);
    }
};
