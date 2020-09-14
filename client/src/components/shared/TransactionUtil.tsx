import { Transaction, Account } from '../../types';

export const createTransaction = async (transaction: Transaction): Promise<void> => {
    try {
        const transactionInfo = JSON.stringify({
            _id: transaction._id,
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
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        return;
    } catch (error) {
        throw Error(`Error creating transaction: ${error}`);
    }
};

export const deleteTransactions = async (transactionIDs: string[]): Promise<void> => {
    try {
        const transactionInfo = JSON.stringify(transactionIDs);
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: transactionInfo,
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        console.log(`Error deleting transactions: ${error}`);
    }
};

export const updateTransaction = async (id: string, transaction: Transaction): Promise<void> => {
    try {
        const transactionInfo = JSON.stringify({
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
        });
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: transactionInfo,
        });
        if (!response.ok) {
            throw Error(`Bad response from server`);
        }
    } catch (error) {
        throw Error(`Error updating transaction: ${error}`);
    }
};

export const updateMultipleTransactions = async (
    transactionIDs: string[],
    transaction: Transaction
): Promise<void> => {
    try {
        const transactionInfo = JSON.stringify({
            transaction: {
                description: transaction.description,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
            },
            transactionIDs: transactionIDs,
        });
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: transactionInfo,
        });
        if (!response.ok) {
            throw Error(`Bad response from server`);
        }
    } catch (error) {
        throw Error(`Error updating multiple transactions: ${error}`);
    }
};

export const addAndUpdateCategory = async (
    name: string,
    type: string,
    oldName: string,
    transactionIDs: string[]
): Promise<void> => {
    try {
        if (oldName && transactionIDs) {
            Promise.all([
                fetch(`${process.env.BACKEND_URI}/api/category/${oldName}`, {
                    method: 'DELETE',
                    credentials: 'include',
                }),
                fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transactionIDs: transactionIDs,
                        category: oldName,
                        newCategory: name,
                    }),
                }),
            ]).then(([deleteResponse, editResponse]) => {
                if (!deleteResponse.ok || !editResponse.ok) {
                    throw Error('Bad response from server');
                }
            });
        }
        const response = await fetch(`${process.env.BACKEND_URI}/api/category`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                type: type,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        throw Error(`Error ${oldName ? 'editing' : 'adding'} transaction: ${error}`);
    }
};

export const deleteCategory = async (name: string, transactionIDs: string[]): Promise<void> => {
    try {
        await Promise.all([
            fetch(`${process.env.BACKEND_URI}/api/category/${name}`, {
                method: 'DELETE',
                credentials: 'include',
            }),
            fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionIDs: transactionIDs,
                    category: name,
                }),
            }),
        ]).then(([deleteResponse, editResponse]) => {
            if (!deleteResponse.ok || !editResponse.ok) {
                throw Error('Bad response from server');
            }
        });
    } catch (error) {
        throw Error(`Error deleting transaction: ${error}`);
    }
};

export const moneyFormat = (money: number): string => {
    if (money < 0) {
        return `-$${Math.abs(money)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return `$${money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const parseAccountInfo = (
    accounts: Account[],
    selectedAccountID: string
): {
    institution: string;
    name: string;
    balance: number;
    debt: number;
    available: number;
    creditLimit: number;
    type: string;
} => {
    if (selectedAccountID === 'All Accounts') {
        const totalBalance = accounts
            .map((account: Account) =>
                account.type === 'investment' ||
                account.type === 'depository' ||
                account.type === 'other'
                    ? account.balance
                    : 0
            )
            .reduce((total: number, balance: number) => total + balance);
        const totalDebt = accounts
            .map((account: Account) =>
                account.type === 'credit' || account.type === 'loan' ? account.balance : 0
            )
            .reduce((total: number, debt: number) => total + debt);
        return {
            institution: 'All Accounts',
            name: `${accounts.length} accounts`,
            balance: totalBalance,
            debt: totalDebt,
            available: null,
            creditLimit: null,
            type: null,
        };
    }
    const selectedAccount = accounts.find((account: Account) => account.id === selectedAccountID);
    let available = null;
    if (selectedAccount.type === 'credit') {
        available = selectedAccount.creditLimit - selectedAccount.balance;
    } else if (selectedAccount.available) {
        available = selectedAccount.available;
    }
    return {
        institution: selectedAccount.institution,
        name: selectedAccount.name,
        balance: selectedAccount.balance,
        debt: null,
        available: available,
        creditLimit: selectedAccount.creditLimit || null,
        type: selectedAccount.type,
    };
};
