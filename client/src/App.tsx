// REACT //
import React, { Suspense, useReducer, useEffect, createContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadEmail } from './redux/Actions';

// COMPONENTS //
import Header from './components/shared/Header';
import {
    fetchTransactions,
    fetchAccounts,
    fetchCategories,
    fetchBudgets,
} from './components/shared/Resources';
import FallbackSpinner from './components/shared/FallbackSpinner';

// TYPES //
import { RootState, Transaction, Account, Category, Budget } from './types';

// VIEWS //
const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */ './view/Home'));
const Transactions = React.lazy(
    () => import(/* webpackChunkName: 'Transactions' */ './view/Transactions')
);
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));

interface HeaderContextType {
    subpage: string;
    setSubpage: (subpage: string) => void;
    logout: () => void;
}

interface ResourcesContextType {
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

export const HeaderContext = createContext<HeaderContextType>(null);
export const ResourcesContext = createContext<ResourcesContextType>(null);

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | {
          type: 'SET_ALL_RESOURCES';
          transactions: Transaction[];
          accounts: Account[];
          categories: Category[];
          budgets: Budget[];
      }
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SET_ACCOUNTS'; accounts: Account[] }
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_BUDGETS'; budgets: Budget[] }
    | { type: 'SET_SUBPAGE'; subpage: string }
    | { type: 'SET_REFRESH_MESSAGE'; message: string };

interface ReducerState {
    loading: boolean;
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
                transactions: action.transactions,
                accounts: action.accounts,
                categories: action.categories,
                budgets: action.budgets,
            };
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
    const reduxDispatch = useDispatch();
    const reduxEmail = useSelector((redux: RootState) => redux.email);
    const sessionEmail = sessionStorage.getItem('email');
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        transactions: [],
        accounts: [],
        categories: [],
        budgets: [],
        subpage: '',
        refreshMessage: '',
    });

    const fetchResources = async () => {
        dispatch({ type: 'SET_LOADING', loading: true });
        await Promise.all([
            fetchTransactions(),
            fetchAccounts(),
            fetchCategories(),
            fetchBudgets(),
        ]).then(([transactions, accounts, categories, budgets]) => {
            dispatch({
                type: 'SET_ALL_RESOURCES',
                transactions: transactions,
                accounts: accounts,
                // eslint-disable-next-line prettier/prettier
                categories: [...categories, { name: 'Bank Fees', type: 'expenses' }, { name: 'Legal Fees', type: 'expenses' }, { name: 'Charitable Giving', type: 'expenses' }, { name: 'Medical', type: 'expenses' }, { name: 'Check', type: 'expenses' }, { name: 'Education', type: 'expenses' }, { name: 'Membership Fee', type: 'expenses' }, { name: 'Service', type: 'expenses' }, { name: 'Utilities', type: 'expenses' }, { name: 'Postage/Shipping', type: 'expenses' }, { name: 'Restaurant', type: 'expenses' }, { name: 'Entertainment', type: 'expenses' }, { name: 'Loan', type: 'expenses' }, { name: 'Rent', type: 'expenses' }, { name: 'Home Maintenance/Improvement', type: 'expenses' }, { name: 'Automotive', type: 'expenses' }, { name: 'Electronic', type: 'expenses' }, { name: 'Insurance', type: 'expenses' }, { name: 'Business Expenditure', type: 'expenses' }, { name: 'Real Estate', type: 'expenses' }, { name: 'Personal Care', type: 'expenses' }, { name: 'Gas', type: 'expenses' }, { name: 'Subscription', type: 'expenses' }, { name: 'Travel', type: 'expenses' }, { name: 'Shopping', type: 'expenses' }, { name: 'Clothing', type: 'expenses' }, { name: 'Groceries', type: 'expenses' }, { name: 'Tax', type: 'expenses' }, { name: 'Subsidy', type: 'income' }, { name: 'Interest', type: 'income' }, { name: 'Deposit', type: 'income' }, { name: 'Payroll/Salary', type: 'income' }, { name: 'Transfer', type: 'other' }, { name: 'Investment', type: 'other' }, { name: 'Savings', type: 'other' }, { name: 'Cash', type: 'other' }, { name: 'Retirement', type: 'other' }, { name: 'Uncategorized', type: 'other' }],
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

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
        } catch (error) {
            throw Error(`Error logging out: ${error}`);
        }
        if (reduxEmail) {
            reduxDispatch(loadEmail(''));
        }
        if (sessionEmail) {
            sessionStorage.setItem('email', '');
        }
        dispatch({ type: 'SET_SUBPAGE', subpage: 'home' });
        props.history.push('/signin');
    };

    useEffect(() => {
        if (!reduxEmail && !sessionEmail) {
            props.history.push('/signin');
        } else {
            dispatch({ type: 'SET_SUBPAGE', subpage: props.subpage });
        }
    }, []);

    if (state.loading) {
        return (
            <HeaderContext.Provider
                value={{
                    subpage: state.subpage,
                    setSubpage: (newSubpage: string) =>
                        dispatch({ type: 'SET_SUBPAGE', subpage: newSubpage }),
                    logout: logout,
                }}
            >
                <Header />
                <FallbackSpinner show message={state.refreshMessage} />
            </HeaderContext.Provider>
        );
    }
    return (
        <HeaderContext.Provider
            value={{
                subpage: state.subpage,
                setSubpage: (newSubpage: string) =>
                    dispatch({ type: 'SET_SUBPAGE', subpage: newSubpage }),
                logout: logout,
            }}
        >
            <Header />
            <ResourcesContext.Provider
                value={{
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
                <Suspense fallback={<FallbackSpinner show />}>
                    {state.subpage === 'home' ? (
                        <Home />
                    ) : state.subpage === 'transactions' ? (
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
                        <div>404</div>
                    )}
                </Suspense>
            </ResourcesContext.Provider>
        </HeaderContext.Provider>
    );
};

export default withRouter(App);
