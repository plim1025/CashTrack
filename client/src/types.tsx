import rootReducer from './redux/Reducers';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface Transaction {
    date: Date | string;
    description: string;
    category: string;
    amount: number;
    _id?: string;
    accountID?: string;
    transactionID?: string;
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
    batchID?: string;
}

export interface Resources {
    transactions: { read: () => Transaction[] };
    accounts: { read: () => Account[] };
}

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
