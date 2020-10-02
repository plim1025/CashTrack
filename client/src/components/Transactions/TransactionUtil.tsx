import { Transaction, Account } from '../../types';

export const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
    try {
        const response = await fetch('/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                description: transaction.description,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const newTransaction = await response.json();
        return newTransaction;
    } catch (error) {
        throw Error(`Error creating transaction: ${error}`);
    }
};

export const deleteTransactions = async (transactionIDs: string[]): Promise<void> => {
    try {
        const response = await fetch('/api/transaction', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ transactionIDs: transactionIDs }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        console.log(`Error deleting transactions: ${error}`);
    }
};

export const updateTransactions = async (
    transactionIDs: string[],
    transaction: Transaction
): Promise<Transaction[]> => {
    try {
        const response = await fetch('/api/transaction', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                transaction: {
                    description: transaction.description,
                    amount: transaction.amount,
                    category: transaction.category,
                    date: transaction.date,
                },
                transactionIDs: transactionIDs,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const newTransactions = await response.json();
        return newTransactions;
    } catch (error) {
        throw Error(`Error updating multiple transactions: ${error}`);
    }
};

export const parseAccountInfo = (accounts: Account[], selectedAccountID: string): Account => {
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
            id: 'All Accounts',
            institution: 'All Accounts',
            name: `${accounts.length} accounts`,
            balance: totalBalance,
            debt: totalDebt,
            available: null,
            creditLimit: null,
            type: null,
            subtype: null,
            mask: null,
            batchID: null,
            lastUpdated: null,
            hidden: null,
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
        id: selectedAccount.id,
        batchID: selectedAccount.batchID,
        institution: selectedAccount.institution,
        name: selectedAccount.name,
        balance: selectedAccount.balance,
        debt: null,
        available: available,
        creditLimit: selectedAccount.creditLimit || null,
        type: selectedAccount.type,
        subtype: selectedAccount.subtype,
        mask: selectedAccount.mask,
        lastUpdated: selectedAccount.lastUpdated,
        hidden: selectedAccount.hidden,
    };
};

export const formatDate = (cell: Date): string => {
    const date = new Date(cell);
    return `${date.getUTCMonth() + 1 < 10 ? 0 : ''}${date.getUTCMonth() + 1}/${
        date.getUTCDate() < 10 ? 0 : ''
    }${date.getUTCDate()}/${date.getUTCFullYear()}`;
};

export const sortDate = (a: string, b: string, order: string): number => {
    if (order === 'asc') return Date.parse(a) - Date.parse(b);
    return Date.parse(b) - Date.parse(a);
};

export const validateDate = (newValue: string): { valid: boolean; message?: string } => {
    if (!newValue) {
        return {
            valid: false,
            message: 'Invalid Date',
        };
    }
    return { valid: true };
};

export const formatDescription = (cell: string): string => {
    if (cell.length > 30) return `${cell.substring(0, 30)}...`;
    return cell;
};

export const validateDescription = (newValue: string): { valid: boolean; message?: string } => {
    if (!newValue) {
        return {
            valid: false,
            message: 'Description cannot be empty',
        };
    }
    return { valid: true };
};

export const validateAmount = (newValue: any): { valid: boolean; message?: string } => {
    if (isNaN(newValue) || !newValue) {
        return {
            valid: false,
            message: 'Amount should be numeric',
        };
    }
    if (parseInt(newValue) > 1000000000) {
        return {
            valid: false,
            message: 'Maximum amount is $1,000,000,000',
        };
    }
    return { valid: true };
};
