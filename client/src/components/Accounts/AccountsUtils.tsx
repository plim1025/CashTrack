import { Account } from '../../types';

export const parseDate = (date: Date): string => {
    const now = new Date();
    const lastUpdated = new Date(date);
    const minute = 60000;
    const hour = 3600000;
    const day = 86400000;
    const month = 2592000000;
    const year = 31536000000;
    const msDifference = now.getTime() - lastUpdated.getTime();
    if (msDifference < hour) {
        const units = Math.floor(msDifference / minute);
        return `${units} minute${units > 1 ? 's' : ''} ago`;
    }
    if (msDifference < day) {
        const units = Math.floor(msDifference / hour);
        return `${units} hour${units > 1 ? 's' : ''} ago`;
    }
    if (msDifference < month) {
        const units = Math.floor(msDifference / day);
        return `${units} day${units > 1 ? 's' : ''} ago`;
    }
    if (msDifference < year) {
        const units = Math.floor(msDifference / year);
        return `${units} month${units > 1 ? 's' : ''} ago`;
    }
    return 'more than a year ago';
};

export const parseSubtype = (subtype: string): string => {
    if (subtype === 'cash isa') {
        return 'cash ISA';
    }
    if (subtype === 'roth 401k') {
        return 'ROTH 401k';
    }
    if (subtype === 'simple ira') {
        return 'simple IRA';
    }
    return subtype;
};

export const updateAccount = async (
    accountID: string,
    accountInfo: { name: string; hidden: boolean }
): Promise<Account> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount/${accountID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name: accountInfo.name,
                hidden: accountInfo.hidden,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const newResponse = await response.json();
        return newResponse;
    } catch (error) {
        throw Error(`Error updating account: ${error}`);
    }
};

export const deleteAccounts = async (batchID: string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount/${batchID}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        throw Error(`Error deleting accounts: ${error}`);
    }
};
