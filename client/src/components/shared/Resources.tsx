// TYPES //
import { Transaction, Account, Category } from '../../types';

const wrapPromise = (promise: any, promiseName: string) => {
    let status = 'loading';
    let result: any;
    const suspender = promise.then(
        (data: any) => {
            status = 'success';
            result = data;
        },
        (error: any) => {
            status = 'error';
            result = error;
        }
    );

    return {
        read() {
            if (status === 'loading') {
                console.log(promiseName);
                throw suspender;
            } else if (status === 'error') {
                throw result;
            } else if (status === 'success') {
                return result;
            }
        },
    };
};

const fetchTransactions = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        if (parsedResponse.length) {
            const typedResponse = parsedResponse.map((transaction: Transaction) => {
                const date = new Date(transaction.date);
                date.setDate(date.getDate() + 1);
                const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                return {
                    ...transaction,
                    date: dateString,
                    amount: transaction.amount * -1,
                    selected: true,
                };
            });
            return typedResponse;
        }
        return [];
    } catch (error) {
        throw Error(`Error fetching transactions: ${error}`);
    }
};

const fetchAccounts = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        if (parsedResponse.length) {
            const typedResponse = parsedResponse.map(({ batchID, ...account }: Account) => account);
            return typedResponse;
        }
        return [];
    } catch (error) {
        throw Error(`Error fetching accounts: ${error}`);
    }
};

const fetchCategories = async () => {
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

const createResource = (): {
    transactions: { read: () => Transaction[] };
    accounts: { read: () => Account[] };
    categories: { read: () => Category[] };
} => {
    return {
        transactions: wrapPromise(fetchTransactions(), 'transactions'),
        accounts: wrapPromise(fetchAccounts(), 'accounts'),
        categories: wrapPromise(fetchCategories(), 'categories'),
    };
};

export default createResource;
