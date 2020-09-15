import rootReducer from './redux/Reducers';
// import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface Transaction {
    date: Date | string;
    description: string;
    category: string;
    amount: number;
    _id?: string;
    accountID?: string;
    transactionID?: string;
    categoryID?: string;
    merchant?: string;
    selected?: boolean;
    type?: 'expense' | 'income' | 'other';
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

export interface Category {
    name: string;
    type: 'expense' | 'income' | 'other';
}

export type RootState = ReturnType<typeof rootReducer>;

// export type AppThunk<ReturnType = void> = ThunkAction<
//     ReturnType,
//     RootState,
//     unknown,
//     Action<string>
// >;

export type Trends = 'expense' | 'income' | 'net earnings' | 'net worth';
export type Subtrends = 'date' | 'category' | 'merchant';
export type Dates = 'all time' | 'year' | 'month' | 'week';
export type Charts = 'bar' | 'pie';

export interface Data {
    id: string;
    value: number;
    [key: string]: string | number;
}
