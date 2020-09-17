import rootReducer from './redux/Reducers';
// import { Action } from 'redux';
// import { ThunkAction } from 'redux-thunk';

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
    type?: 'expenses' | 'income' | 'other';
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
    type: 'expenses' | 'income' | 'other';
}

export type RootState = ReturnType<typeof rootReducer>;

// export type AppThunk<ReturnType = void> = ThunkAction<
//     ReturnType,
//     RootState,
//     unknown,
//     Action<string>
// >;

export type Trends = 'expenses' | 'income' | 'net earnings' | 'net worth';
export type Subtrends = 'date' | 'category' | 'merchant';
export type Dates = 'all time' | 'year' | 'month' | 'week';
export type Charts = 'bar' | 'pie';

export interface Data {
    id: string;
    value: number;
    [key: string]: string | number;
}

export interface DropdownOption {
    value: string;
    label: string;
    sublabel?: string;
}

export interface GroupedDropdownOption {
    label: string;
    options: DropdownOption[];
    sublabel?: string;
}
