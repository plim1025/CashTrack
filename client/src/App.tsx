// REACT //
import React, { Suspense, useReducer, useEffect, createContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useSelector } from 'react-redux';

// COMPONENTS //
import Header from './components/shared/Header';
import {
    fetchUser,
    fetchTransactions,
    fetchAccounts,
    fetchCategories,
    fetchBudgets,
} from './components/shared/Resources';
import FallbackSpinner from './components/shared/FallbackSpinner';

// TYPES //
import { RootState, User, Transaction, Account, Category, Budget } from './types';

// VIEWS //
const Transactions = React.lazy(
    () => import(/* webpackChunkName: 'Transactions' */ './view/Transactions')
);
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));
const BadRequest = React.lazy(
    () => import(/* webpackChunkName: 'BadRequest' */ './view/BadRequest')
);

interface ResourcesContextType {
    user: User;
    setUser: (user: User) => void;
    transactions: Transaction[];
    setTransactions: (transactions: Transaction[]) => void;
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    budgets: Budget[];
    setBudgets: (budgets: Budget[]) => void;
    refresh: (message?: string) => void;
}

export const ResourcesContext = createContext<ResourcesContextType>(null);

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | {
          type: 'SET_ALL_RESOURCES';
          user: User;
          transactions: Transaction[];
          accounts: Account[];
          categories: Category[];
          budgets: Budget[];
      }
    | { type: 'SET_USER'; user: User }
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SET_ACCOUNTS'; accounts: Account[] }
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_BUDGETS'; budgets: Budget[] }
    | { type: 'SET_SUBPAGE'; subpage: string }
    | { type: 'SET_REFRESH_MESSAGE'; message: string };

interface ReducerState {
    loading: boolean;
    user: User;
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    budgets: Budget[];
    subpage: string;
    refreshMessage: string;
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_ALL_RESOURCES':
            return {
                ...state,
                user: action.user,
                transactions: action.transactions,
                accounts: action.accounts,
                categories: action.categories,
                budgets: action.budgets,
            };
        case 'SET_USER':
            return { ...state, user: action.user };
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.transactions };
        case 'SET_ACCOUNTS':
            return { ...state, accounts: action.accounts };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.categories };
        case 'SET_BUDGETS':
            return { ...state, budgets: action.budgets };
        case 'SET_SUBPAGE':
            return { ...state, subpage: action.subpage };
        case 'SET_REFRESH_MESSAGE':
            return { ...state, refreshMessage: action.message };
        default:
            return state;
    }
};

interface Props {
    subpage: string;
}

const App: React.FC<Props & RouteComponentProps> = props => {
    const reduxEmail = useSelector((redux: RootState) => redux.email);
    const sessionEmail = sessionStorage.getItem('email');
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        user: null,
        transactions: [],
        accounts: [],
        categories: [],
        budgets: [],
        subpage: props.subpage,
        refreshMessage: '',
    });

    const fetchResources = async () => {
        dispatch({ type: 'SET_LOADING', loading: true });
        await Promise.all([
            fetchUser(),
            fetchTransactions(),
            fetchAccounts(),
            fetchCategories(),
            fetchBudgets(),
        ]).then(([user, transactions, accounts, categories, budgets]) => {
            const hiddenAccountIDs = accounts
                .filter(account => account.hidden)
                .map(account => account.id);
            const parsedTransactions = transactions.filter(
                transaction => hiddenAccountIDs.indexOf(transaction.accountID) === -1
            );
            dispatch({
                type: 'SET_ALL_RESOURCES',
                user: user,
                transactions: parsedTransactions,
                accounts: accounts,
                categories: [
                    ...categories,
                    { name: 'Bank Fees', type: 'expenses' },
                    { name: 'Legal Fees', type: 'expenses' },
                    { name: 'Charitable Giving', type: 'expenses' },
                    { name: 'Medical', type: 'expenses' },
                    { name: 'Check', type: 'expenses' },
                    { name: 'Education', type: 'expenses' },
                    { name: 'Membership Fee', type: 'expenses' },
                    { name: 'Service', type: 'expenses' },
                    { name: 'Utilities', type: 'expenses' },
                    { name: 'Postage/Shipping', type: 'expenses' },
                    { name: 'Restaurant', type: 'expenses' },
                    { name: 'Entertainment', type: 'expenses' },
                    { name: 'Loan', type: 'expenses' },
                    { name: 'Rent', type: 'expenses' },
                    { name: 'Home Maintenance/Improvement', type: 'expenses' },
                    { name: 'Automotive', type: 'expenses' },
                    { name: 'Electronic', type: 'expenses' },
                    { name: 'Insurance', type: 'expenses' },
                    { name: 'Business Expenditure', type: 'expenses' },
                    { name: 'Real Estate', type: 'expenses' },
                    { name: 'Personal Care', type: 'expenses' },
                    { name: 'Gas', type: 'expenses' },
                    { name: 'Subscription', type: 'expenses' },
                    { name: 'Travel', type: 'expenses' },
                    { name: 'Shopping', type: 'expenses' },
                    { name: 'Clothing', type: 'expenses' },
                    { name: 'Groceries', type: 'expenses' },
                    { name: 'Tax', type: 'expenses' },
                    { name: 'Subsidy', type: 'income' },
                    { name: 'Interest', type: 'income' },
                    { name: 'Deposit', type: 'income' },
                    { name: 'Payroll/Salary', type: 'income' },
                    { name: 'Transfer', type: 'other' },
                    { name: 'Investment', type: 'other' },
                    { name: 'Savings', type: 'other' },
                    { name: 'Cash', type: 'other' },
                    { name: 'Retirement', type: 'other' },
                    { name: 'Uncategorized', type: 'other' },
                ],
                budgets: budgets,
            });
        });
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    useEffect(() => {
        if (reduxEmail || sessionEmail) {
            fetchResources();
        }
    }, []);

    useEffect(() => {
        if (!reduxEmail && !sessionEmail) {
            props.history.push('/signin');
        } else {
            dispatch({ type: 'SET_SUBPAGE', subpage: props.subpage });
        }
    }, []);

    if (state.loading) {
        return (
            <>
                <Header
                    subpage={state.subpage}
                    setSubpage={(newSubpage: string) =>
                        dispatch({ type: 'SET_SUBPAGE', subpage: newSubpage })
                    }
                />
                <FallbackSpinner show message={state.refreshMessage} />
            </>
        );
    }
    return (
        <ResourcesContext.Provider
            value={{
                user: state.user,
                setUser: (newUser: User) => dispatch({ type: 'SET_USER', user: newUser }),
                transactions: state.transactions,
                setTransactions: (newTransactions: Transaction[]) =>
                    dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions }),
                accounts: state.accounts,
                setAccounts: (newAccounts: Account[]) =>
                    dispatch({ type: 'SET_ACCOUNTS', accounts: newAccounts }),
                categories: state.categories,
                setCategories: (newCategories: Category[]) =>
                    dispatch({ type: 'SET_CATEGORIES', categories: newCategories }),
                budgets: state.budgets,
                setBudgets: (newBudgets: Budget[]) =>
                    dispatch({ type: 'SET_BUDGETS', budgets: newBudgets }),
                refresh: (message?: string) => {
                    dispatch({ type: 'SET_REFRESH_MESSAGE', message: message || '' });
                    fetchResources();
                },
            }}
        >
            <Header
                subpage={state.subpage}
                setSubpage={(newSubpage: string) =>
                    dispatch({ type: 'SET_SUBPAGE', subpage: newSubpage })
                }
            />
            <Suspense fallback={<FallbackSpinner show />}>
                {state.subpage === 'transactions' ? (
                    <Transactions />
                ) : state.subpage === 'trends' ? (
                    <Trends />
                ) : state.subpage === 'budgets' ? (
                    <Budgets />
                ) : state.subpage === 'accounts' ? (
                    <Accounts />
                ) : state.subpage === 'settings' ? (
                    <Settings />
                ) : (
                    <BadRequest />
                )}
            </Suspense>
        </ResourcesContext.Provider>
    );
};

export default withRouter(App);
