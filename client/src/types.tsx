export interface Transaction {
    _id?: string;
    accountID?: string;
    transactionID?: string;
    date: string;
    description: string;
    category: string;
    amount: string;
    selected?: boolean;
}

export interface Account {
    id: string;
    name: string;
    institution: string;
    type: string;
    mask: string;
    balance: number;
    available?: number;
    creditLimit?: number;
}
