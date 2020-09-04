export interface Transaction {
    _id?: string;
    accountID?: string;
    transactionID?: string;
    date: string;
    description: string;
    category: string;
    amount: string;
}
