// TYPES //
import { Transaction, Account } from '../../types';

const wrapPromise = (promise: any) => {
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
                    amount: (transaction.amount * -1).toFixed(2),
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const createResource = (): {
    transactions: { read: () => Transaction[] };
    accounts: { read: () => Account[] };
} => {
    return {
        transactions: wrapPromise(fetchTransactions()),
        accounts: wrapPromise(fetchAccounts()),
    };
};

export default createResource;
