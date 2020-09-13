// REACT //
import React, { useEffect, useReducer, useContext, createContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useDispatch } from 'react-redux';
import { loadSubpage } from '../redux/Actions';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Table from '../components/Transactions/Table';
import TransactionModal from '../components/Transactions/TransactionModal';
import CategoryModal from '../components/Transactions/CategoryModal';
import CategorySubmodal from '../components/Transactions/CategorySubmodal';
import Sidebar from '../components/Transactions/Sidebar';
import AccountInfo from '../components/Transactions/AccountInfo';
import Buttons from '../components/Transactions/Buttons';
import Error from '../components/shared/Error';
import { Button } from 'react-bootstrap';
import { v1 as uuidv4 } from 'uuid';
import {
    createTransaction,
    updateTransaction,
    updateMultipleTransactions,
    deleteTransactions,
} from '../components/shared/TransactionUtil';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Account } from '../types';

type Actions =
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SET_ACCOUNTS'; accounts: Account[] }
    | { type: 'SET_SELECTED_TRANSACTION_IDS'; ids: string[] }
    | { type: 'SET_SELECTED_ACCOUNT_ID'; id: string }
    | { type: 'SHOW_TRANSACTION_ADD_MODAL' }
    | { type: 'SHOW_TRANSACTION_EDIT_MODAL' }
    | { type: 'HIDE_TRANSACTION_MODAL' }
    | { type: 'SHOW_CATEGORY_MODAL' }
    | { type: 'HIDE_CATEGORY_MODAL' }
    | { type: 'SHOW_CATEGORY_SUBMODAL'; category: { name: string; type: string } }
    | { type: 'HIDE_CATEGORY_SUBMODAL' }
    | { type: 'SET_ERROR'; message: string }
    | { type: 'HIDE_ERROR' };

interface ReducerState {
    transactions: Transaction[];
    accounts: Account[];
    selectedTransactionIDs: string[];
    selectedAccountID: string;
    transactionModal: {
        show: boolean;
        mode: string;
    };
    categoryModal: boolean;
    categorySubmodal: {
        show: boolean;
        category: {
            name: string;
            type: string;
        };
    };
    error: {
        show: boolean;
        message: string;
    };
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.transactions };
        case 'SET_ACCOUNTS':
            return { ...state, accounts: action.accounts };
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
                    category: {
                        name: action.category.name,
                        type: action.category.type,
                    },
                },
            };
        case 'HIDE_CATEGORY_SUBMODAL':
            return {
                ...state,
                categoryModal: true,
                categorySubmodal: { ...state.categorySubmodal, show: false },
            };
        case 'SET_ERROR':
            return { ...state, error: { show: true, message: action.message } };
        case 'HIDE_ERROR':
            return { ...state, error: { ...state.error, show: false } };
        default:
            return state;
    }
};

export const CategoryModalContext = createContext({
    openCategoryModal: null,
    closeCategoryModal: null,
    openCategorySubmodal: null,
    closeCategorySubmodal: null,
});

const Transactions: React.FC<RouteComponentProps> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const { transactions, accounts } = useContext(ResourcesContext);
    const reduxDispatch = useDispatch();
    const [state, dispatch] = useReducer(reducer, {
        transactions: transactions.read(),
        accounts: accounts.read(),
        selectedTransactionIDs: [],
        selectedAccountID: 'All Accounts',
        transactionModal: {
            show: false,
            mode: 'add',
        },
        categoryModal: false,
        categorySubmodal: {
            show: false,
            category: {
                name: '',
                type: '',
            },
        },
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
    }, [transactions, accounts]);

    const handleCreateTransaction = async (newTransaction: Transaction) => {
        const newID = uuidv4().substr(0, 12);
        const newTransactions = [
            ...state.transactions,
            { ...newTransaction, _id: newID, selected: true },
        ];
        dispatch({
            type: 'SET_TRANSACTIONS',
            transactions: newTransactions,
        });
        await createTransaction({ ...newTransaction, _id: newID });
    };

    const handleEditTransaction = async (transactionID: string, newTransaction: Transaction) => {
        const newTransactions = [
            ...state.transactions.filter(transaction => transaction._id !== transactionID),
            newTransaction,
        ];
        dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
        await updateTransaction(transactionID, newTransaction);
    };

    const handleEditMultipleTransactions = async (newTransaction: Transaction) => {
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
        await updateMultipleTransactions(state.selectedTransactionIDs, newTransaction);
    };

    const handleDeleteMultipleTransactions = async () => {
        if (!state.selectedTransactionIDs.length) {
            dispatch({ type: 'SET_ERROR', message: 'No transactions selected to delete' });
            errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
        } else {
            const newTransactions = state.transactions.filter(
                (transaction: Transaction) =>
                    state.selectedTransactionIDs.indexOf(transaction._id) === -1
            );
            dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
            dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: [] });
            await deleteTransactions(state.selectedTransactionIDs);
        }
    };

    const handleEditButton = () => {
        if (!state.selectedTransactionIDs.length) {
            dispatch({ type: 'SET_ERROR', message: 'No transactions selected to edit' });
            errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
        } else {
            dispatch({ type: 'SHOW_TRANSACTION_EDIT_MODAL' });
        }
    };

    const navigateToAccountsPage = () => {
        props.history.push('/accounts');
        reduxDispatch(loadSubpage('accounts'));
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <CategoryModalContext.Provider
            value={{
                openCategoryModal: () => dispatch({ type: 'SHOW_CATEGORY_MODAL' }),
                closeCategoryModal: () => dispatch({ type: 'HIDE_CATEGORY_MODAL' }),
                openCategorySubmodal: (name?: string, type?: string) =>
                    dispatch({
                        type: 'SHOW_CATEGORY_SUBMODAL',
                        category: { name: name, type: type },
                    }),
                closeCategorySubmodal: () => dispatch({ type: 'HIDE_CATEGORY_SUBMODAL' }),
            }}
        >
            <div className={css(ss.wrapper)}>
                {/* <Sidebar
                accounts={state.accounts}
                selectedAccountID={state.selectedAccountID}
                setSelectedAccountID={(id: string) =>
                    dispatch({ type: 'SET_SELECTED_ACCOUNT_ID', id: id })
                }
            /> */}
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
                            <Button variant='link' onClick={navigateToAccountsPage}>
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
                        updateTransaction={handleEditTransaction}
                    />
                    <TransactionModal
                        toggled={state.transactionModal.show}
                        mode={state.transactionModal.mode}
                        close={() => dispatch({ type: 'HIDE_TRANSACTION_MODAL' })}
                        handleCreateTransaction={handleCreateTransaction}
                        handleEditMultipleTransactions={handleEditMultipleTransactions}
                    />
                    <CategoryModal
                        toggled={state.categoryModal}
                        close={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
                    />
                    <CategorySubmodal
                        toggled={state.categorySubmodal.show}
                        close={() => dispatch({ type: 'HIDE_CATEGORY_SUBMODAL' })}
                    />
                </div>
                <Error error={state.error.show} errorMessage={state.error.message} />
            </div>
        </CategoryModalContext.Provider>
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
