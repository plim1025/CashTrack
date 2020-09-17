import { Transaction, Account, Category, GroupedDropdownOption } from '../../types';

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

export const moneyFormat = (money: number | string | Date): string => {
    if (typeof money === 'number') {
        if (money < 0) {
            return `-$${Math.abs(money)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return `$${money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    if (typeof money === 'string') {
        const moneyNum = parseFloat(money);
        if (moneyNum < 0) {
            return `-$${Math.abs(moneyNum)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return `$${moneyNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return 'Error, cannot parse money from date';
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

export const formatDate = (cell: Date): string => {
    const date = new Date(cell);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
};

export const sortDate = (a: string, b: string, order: string): number => {
    if (order === 'asc') return Date.parse(a) - Date.parse(b);
    return Date.parse(b) - Date.parse(a);
};

export const validateDate = (newValue: any): { valid: boolean; message?: string } => {
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

export const validateDescription = (newValue: any): { valid: boolean; message?: string } => {
    if (!newValue) {
        return {
            valid: false,
            message: 'Description cannot be empty',
        };
    }
    return { valid: true };
};

export const formatAmount = (cell: string): string => {
    const parsedCell = parseFloat(cell);
    if (parsedCell < 0) return `-$${Math.abs(parsedCell).toFixed(2)}`;
    return `$${parsedCell.toFixed(2)}`;
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

const parseCategoryGroup = (categories: Category[], type: string) => {
    return categories
        .filter(category => category.type === type)
        .map(category => ({ value: category.name, label: category.name }))
        .sort((a, b) => (a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1));
};

export const parseCategoryDropdownOptions = (categories: Category[]): GroupedDropdownOption[] => {
    return [
        {
            label: 'expenses',
            options: parseCategoryGroup(categories, 'expenses'),
        },
        {
            label: 'income',
            options: parseCategoryGroup(categories, 'income'),
        },
        {
            label: 'other',
            options: parseCategoryGroup(categories, 'other'),
        },
    ];
};
