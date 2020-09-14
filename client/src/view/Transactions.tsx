// REACT //
import React, { useEffect, useReducer, useContext, createContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Table from '../components/Transactions/Table';
import Modals from '../components/Transactions/Modals';
import Sidebar from '../components/Transactions/Sidebar';
import AccountInfo from '../components/Transactions/AccountInfo';
import Buttons from '../components/Transactions/Buttons';
import ErrorMessage from '../components/shared/ErrorMessage';
import FallbackSpinner from '../components/shared/FallbackSpinner';
import { Button } from 'react-bootstrap';
import { v1 as uuidv4 } from 'uuid';
import {
    createTransaction,
    updateMultipleTransactions,
    deleteTransactions,
} from '../components/shared/TransactionUtil';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Account, Category } from '../types';

// STYLES //
import '../assets/css/transactionTable.css';
import '../assets/css/reactSelectDropdown.css';

export const CategoryContext = createContext({ categories: null, openCategoryModal: null });

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SET_ACCOUNTS'; accounts: Account[] }
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_SELECTED_TRANSACTION_IDS'; ids: string[] }
    | { type: 'SET_SELECTED_ACCOUNT_ID'; id: string }
    | { type: 'SHOW_TRANSACTION_ADD_MODAL' }
    | { type: 'SHOW_TRANSACTION_EDIT_MODAL' }
    | { type: 'HIDE_TRANSACTION_MODAL' }
    | { type: 'SHOW_CATEGORY_MODAL' }
    | { type: 'HIDE_CATEGORY_MODAL' }
    | { type: 'SHOW_CATEGORY_SUBMODAL'; mode: string; category?: Category }
    | { type: 'HIDE_CATEGORY_SUBMODAL' }
    | { type: 'SHOW_CATEGORY_DELETE_MODAL' }
    | { type: 'HIDE_CATEGORY_DELETE_MODAL' }
    | { type: 'SET_ERROR'; message: string }
    | { type: 'HIDE_ERROR' };

interface ReducerState {
    loading: boolean;
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    selectedTransactionIDs: string[];
    selectedAccountID: string;
    transactionModal: {
        show: boolean;
        mode: string;
    };
    categoryModal: boolean;
    categorySubmodal: {
        show: boolean;
        mode: string;
        category: Category;
    };
    categoryDeleteModal: boolean;
    error: {
        show: boolean;
        message: string;
    };
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.transactions };
        case 'SET_ACCOUNTS':
            return { ...state, accounts: action.accounts };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.categories };
        case 'SET_SELECTED_TRANSACTION_IDS':
            return { ...state, selectedTransactionIDs: action.ids };
        case 'SET_SELECTED_ACCOUNT_ID':
            return { ...state, selectedAccountID: action.id };
        case 'SHOW_TRANSACTION_ADD_MODAL':
            return { ...state, transactionModal: { show: true, mode: 'add' } };
        case 'SHOW_TRANSACTION_EDIT_MODAL':
            return { ...state, transactionModal: { show: true, mode: 'edit' } };
        case 'HIDE_TRANSACTION_MODAL':
            return { ...state, transactionModal: { show: false, mode: '' } };
        case 'SHOW_CATEGORY_MODAL':
            return { ...state, categoryModal: true };
        case 'HIDE_CATEGORY_MODAL':
            return { ...state, categoryModal: false };
        case 'SHOW_CATEGORY_SUBMODAL':
            return {
                ...state,
                categoryModal: false,
                categorySubmodal: {
                    show: true,
                    mode: action.mode,
                    category: action.category,
                },
            };
        case 'HIDE_CATEGORY_SUBMODAL':
            return {
                ...state,
                categoryModal: true,
                categorySubmodal: { ...state.categorySubmodal, show: false },
            };
        case 'SHOW_CATEGORY_DELETE_MODAL':
            return {
                ...state,
                categoryDeleteModal: true,
                categorySubmodal: { ...state.categorySubmodal, show: false },
            };
        case 'HIDE_CATEGORY_DELETE_MODAL':
            return {
                ...state,
                categoryDeleteModal: false,
                categoryModal: true,
            };
        case 'SET_ERROR':
            return { ...state, error: { show: true, message: action.message } };
        case 'HIDE_ERROR':
            return { ...state, error: { ...state.error, show: false } };
        default:
            return state;
    }
};

let errorTimeout: ReturnType<typeof setTimeout>;

const Transactions: React.FC<RouteComponentProps> = props => {
    const { transactions, accounts, categories, setSubpage } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        transactions: transactions.read(),
        accounts: accounts.read(),
        categories: categories.read(),
        selectedTransactionIDs: [],
        selectedAccountID: 'All Accounts',
        transactionModal: {
            show: false,
            mode: 'add',
        },
        categoryModal: false,
        categorySubmodal: {
            show: false,
            mode: 'add',
            category: null,
        },
        categoryDeleteModal: false,
        error: {
            show: false,
            message: '',
        },
    });

    useEffect(() => {
        if (state.transactions) {
            const filteredTransactions = state.transactions.map((transaction: Transaction) => {
                if (
                    transaction.accountID === state.selectedAccountID ||
                    state.selectedAccountID === 'All Accounts'
                ) {
                    return { ...transaction, selected: true };
                }
                return { ...transaction, selected: false };
            });
            dispatch({ type: 'SET_TRANSACTIONS', transactions: filteredTransactions });
        }
    }, [state.selectedAccountID]);

    useEffect(() => {
        dispatch({ type: 'SET_TRANSACTIONS', transactions: transactions.read() });
        dispatch({ type: 'SET_ACCOUNTS', accounts: accounts.read() });
        dispatch({ type: 'SET_CATEGORIES', categories: categories.read() });
    }, [transactions, accounts, categories]);

    const handleCreateTransaction = async (newTransaction: Transaction) => {
        const newID = uuidv4().substr(0, 12);
        dispatch({ type: 'SET_LOADING', loading: true });
        await createTransaction({ ...newTransaction, _id: newID });
        const newTransactions = [
            ...state.transactions,
            { ...newTransaction, _id: newID, selected: true },
        ];
        dispatch({
            type: 'SET_TRANSACTIONS',
            transactions: newTransactions,
        });
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleEditMultipleTransactions = async (newTransaction: Transaction) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        await updateMultipleTransactions(state.selectedTransactionIDs, newTransaction);
        const newTransactions = state.transactions.map((transaction: Transaction) => {
            if (state.selectedTransactionIDs.indexOf(transaction._id) !== -1) {
                const oldTransactionInfo = state.transactions.find(
                    (oldTransaction: Transaction) => oldTransaction._id === transaction._id
                );
                return { ...oldTransactionInfo, ...newTransaction };
            }
            return transaction;
        });
        dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
        dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: [] });
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleDeleteMultipleTransactions = async () => {
        if (!state.selectedTransactionIDs.length) {
            dispatch({ type: 'SET_ERROR', message: 'No transactions selected to delete' });
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
        } else {
            dispatch({ type: 'SET_LOADING', loading: true });
            await deleteTransactions(state.selectedTransactionIDs);
            const newTransactions = state.transactions.filter(
                (transaction: Transaction) =>
                    state.selectedTransactionIDs.indexOf(transaction._id) === -1
            );
            dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
            dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: [] });
            dispatch({ type: 'SET_LOADING', loading: false });
        }
    };

    const handleEditButton = () => {
        if (!state.selectedTransactionIDs.length) {
            dispatch({ type: 'SET_ERROR', message: 'No transactions selected to edit' });
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
        } else {
            dispatch({ type: 'SHOW_TRANSACTION_EDIT_MODAL' });
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                categories: state.categories,
                openCategoryModal: () => dispatch({ type: 'SHOW_CATEGORY_MODAL' }),
            }}
        >
            <div className={css(ss.wrapper)}>
                <Sidebar
                    accounts={state.accounts}
                    selectedAccountID={state.selectedAccountID}
                    setSelectedAccountID={(id: string) =>
                        dispatch({ type: 'SET_SELECTED_ACCOUNT_ID', id: id })
                    }
                />
                <div className={css(ss.subWrapper)}>
                    {state.accounts.length ? (
                        <AccountInfo
                            accounts={state.accounts}
                            selectedAccountID={state.selectedAccountID}
                        />
                    ) : null}
                    <Buttons
                        showModal={() => dispatch({ type: 'SHOW_TRANSACTION_ADD_MODAL' })}
                        handleEditButton={handleEditButton}
                        handleDeleteButton={handleDeleteMultipleTransactions}
                    />
                    {!state.accounts.length ? (
                        <div className={css(ss.noTransactionsText)}>
                            <span>No accounts added.</span>
                            <Button
                                variant='link'
                                onClick={() => {
                                    props.history.push('/accounts');
                                    setSubpage('accounts');
                                }}
                            >
                                Link an account.
                            </Button>
                        </div>
                    ) : null}
                    <Table
                        transactions={state.transactions.filter(
                            (transaction: Transaction) => transaction.selected
                        )}
                        selectedTransactionIDs={state.selectedTransactionIDs}
                        setSelectedTransactionIDs={(ids: string[]) =>
                            dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: ids })
                        }
                    />
                </div>
                <Modals
                    setLoading={(loading: boolean) =>
                        dispatch({ type: 'SET_LOADING', loading: loading })
                    }
                    transactions={state.transactions}
                    categories={state.categories}
                    setTransactions={(newTransactions: Transaction[]) => {
                        dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
                    }}
                    setCategories={(newCategories: Category[]) =>
                        dispatch({ type: 'SET_CATEGORIES', categories: newCategories })
                    }
                    transactionModal={state.transactionModal}
                    categoryModal={state.categoryModal}
                    categorySubmodal={state.categorySubmodal}
                    categoryDeleteModal={state.categoryDeleteModal}
                    openCategorySubmodal={(mode: string, category?: Category) =>
                        dispatch({
                            type: 'SHOW_CATEGORY_SUBMODAL',
                            mode: mode,
                            category: category,
                        })
                    }
                    openCategoryDeleteModal={() => dispatch({ type: 'SHOW_CATEGORY_DELETE_MODAL' })}
                    hideTransactionModal={() => dispatch({ type: 'HIDE_TRANSACTION_MODAL' })}
                    hideCategoryModal={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
                    hideCategorySubmodal={() => dispatch({ type: 'HIDE_CATEGORY_SUBMODAL' })}
                    hideCategoryDeleteModal={() => dispatch({ type: 'HIDE_CATEGORY_DELETE_MODAL' })}
                    handleCreateTransaction={handleCreateTransaction}
                    handleEditMultipleTransactions={handleEditMultipleTransactions}
                />
                <ErrorMessage error={state.error.show} errorMessage={state.error.message} />
            </div>
            <FallbackSpinner backdrop show={state.loading} />
        </CategoryContext.Provider>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
    subWrapper: {
        width: '100%',
        padding: 20,
        maxWidth: 800,
    },
    noTransactionsText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default withRouter(Transactions);
