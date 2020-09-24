import rootReducer from './redux/Reducers';
// import { Action } from 'redux';
// import { ThunkAction } from 'redux-thunk';

export interface Transaction {
    _id: string;
    date: Date;
    description: string;
    category: string;
    amount: number;
    accountID: string;
    categoryID?: string;
    type?: string;
    selected?: boolean;
    transactionID?: string;
    merchant?: string;
}

export interface Account {
    id: string;
    batchID: string;
    name: string;
    institution: string;
    type: string;
    mask: string;
    balance: number;
    available?: number;
    creditLimit?: number;
    debt?: number;
}

export interface Category {
    _id?: string;
    name: string;
    type: string;
    selected?: boolean;
}

export interface Budget {
    _id: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    categoryName: string;
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
    value?: number;
    expenses?: number;
    income?: number;
    [key: string]: string | number;
}

export interface DropdownOption {
    value: any;
    label: string;
    sublabel?: string;
}

export interface GroupedDropdownOption {
    label: string;
    options: DropdownOption[];
    sublabel?: string;
}
