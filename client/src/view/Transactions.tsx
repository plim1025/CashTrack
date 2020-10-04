// REACT //
import React, { useEffect, useReducer, useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Table from '../components/Transactions/Table';
import TransactionModal from '../components/Transactions/TransactionModal';
import CategoryModals from '../components/shared/CategoryModals';
import Sidebar from '../components/Transactions/Sidebar';
import AccountInfo from '../components/Transactions/AccountInfo';
import Buttons from '../components/Transactions/Buttons';
import ErrorMessage from '../components/shared/ErrorMessage';
import FallbackSpinner from '../components/shared/FallbackSpinner';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Category } from '../types';

// UTIL //
import {
    createTransaction,
    updateTransactions,
    deleteTransactions,
} from '../components/Transactions/TransactionUtil';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_SELECTED_TRANSACTION_IDS'; ids: string[] }
    | { type: 'SET_SELECTED_ACCOUNT_ID'; id: string }
    | { type: 'SET_BALANCE'; balance: number }
    | { type: 'SHOW_TRANSACTION_ADD_MODAL' }
    | { type: 'SHOW_TRANSACTION_EDIT_MODAL' }
    | { type: 'HIDE_TRANSACTION_MODAL' }
    | { type: 'SHOW_CATEGORY_MODAL' }
    | { type: 'HIDE_CATEGORY_MODAL' }
    | { type: 'SHOW_CATEGORY_SUBMODAL'; mode: string; category: Category }
    | { type: 'HIDE_CATEGORY_SUBMODAL' }
    | { type: 'SHOW_CATEGORY_DELETE_MODAL' }
    | { type: 'HIDE_CATEGORY_DELETE_MODAL' }
    | { type: 'SET_ERROR'; message: string }
    | { type: 'HIDE_ERROR' };

interface ReducerState {
    loading: boolean;
    selectedTransactionIDs: string[];
    selectedAccountID: string;
    balance: number;
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
        case 'SET_SELECTED_TRANSACTION_IDS':
            return { ...state, selectedTransactionIDs: action.ids };
        case 'SET_SELECTED_ACCOUNT_ID':
            return { ...state, selectedAccountID: action.id };
        case 'SET_BALANCE':
            return { ...state, balance: action.balance };
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
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            return { ...state, error: { show: true, message: action.message } };
        case 'HIDE_ERROR':
            return { ...state, error: { ...state.error, show: false } };
        default:
            return state;
    }
};

let errorTimeout: ReturnType<typeof setTimeout>;

const Transactions: React.FC = () => {
    const { transactions, setTransactions, accounts } = useContext(ResourcesContext);

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        selectedTransactionIDs: [],
        selectedAccountID: 'All Accounts',
        balance: 0,
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
        if (transactions) {
            const filteredTransactions = transactions.map(transaction => {
                if (
                    transaction.accountID === state.selectedAccountID ||
                    state.selectedAccountID === 'All Accounts'
                ) {
                    return { ...transaction, selected: true };
                }
                return { ...transaction, selected: false };
            });
            setTransactions(filteredTransactions);
        }
    }, [state.selectedAccountID]);

    useEffect(() => {
        const balance = transactions.filter(transaction => transaction.selected).length
            ? transactions
                  .filter(transaction => transaction.selected)
                  .map(transaction => transaction.amount)
                  .reduce((total, amount) => total + amount)
            : 0;
        dispatch({ type: 'SET_BALANCE', balance });
    }, [transactions]);

    const handleCreateTransaction = async (newTransaction: Transaction) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const createdTransaction = await createTransaction(newTransaction, state.selectedAccountID);
        const newTransactions = [...transactions, createdTransaction];
        setTransactions(newTransactions);
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleEditMultipleTransactions = async (newTransaction: Transaction) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const updatedTransactions = await updateTransactions(
            state.selectedTransactionIDs,
            newTransaction
        );
        const updatedTransactionIDs = updatedTransactions.map(transaction => transaction._id);
        const newTransactions = [
            ...updatedTransactions,
            ...transactions.filter(
                transaction => updatedTransactionIDs.indexOf(transaction._id) === -1
            ),
        ];
        setTransactions(newTransactions);
        dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: [] });
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleDeleteMultipleTransactions = async () => {
        if (!state.selectedTransactionIDs.length) {
            dispatch({ type: 'SET_ERROR', message: 'No transactions selected to delete' });
            errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
        } else {
            dispatch({ type: 'SET_LOADING', loading: true });
            await deleteTransactions(state.selectedTransactionIDs);
            const newTransactions = transactions.filter(
                transaction => state.selectedTransactionIDs.indexOf(transaction._id) === -1
            );
            setTransactions(newTransactions);
            dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: [] });
            dispatch({ type: 'SET_LOADING', loading: false });
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

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <Wrapper>
            <Sidebar
                accounts={accounts}
                selectedAccountID={state.selectedAccountID}
                setSelectedAccountID={(id: string) =>
                    dispatch({ type: 'SET_SELECTED_ACCOUNT_ID', id: id })
                }
            />
            <SubWrapper>
                {accounts.length ? (
                    <AccountInfo
                        accounts={accounts}
                        selectedAccountID={state.selectedAccountID}
                        balance={state.balance}
                    />
                ) : null}
                <Buttons
                    showModal={() => dispatch({ type: 'SHOW_TRANSACTION_ADD_MODAL' })}
                    handleEditButton={handleEditButton}
                    handleDeleteButton={handleDeleteMultipleTransactions}
                />
                {!accounts.length ? (
                    <NoTransactionsText>
                        <span>No accounts added.</span>
                    </NoTransactionsText>
                ) : null}
                <Table
                    selectedTransactionIDs={state.selectedTransactionIDs}
                    setSelectedTransactionIDs={(ids: string[]) =>
                        dispatch({ type: 'SET_SELECTED_TRANSACTION_IDS', ids: ids })
                    }
                    openCategoryModal={() => dispatch({ type: 'SHOW_CATEGORY_MODAL' })}
                />
            </SubWrapper>
            <TransactionModal
                show={state.transactionModal.show}
                mode={state.transactionModal.mode}
                close={() => dispatch({ type: 'HIDE_TRANSACTION_MODAL' })}
                openCategory={() => dispatch({ type: 'SHOW_CATEGORY_MODAL' })}
                handleCreateTransaction={handleCreateTransaction}
                handleEditMultipleTransactions={handleEditMultipleTransactions}
            />
            <CategoryModals
                setLoading={(loading: boolean) =>
                    dispatch({ type: 'SET_LOADING', loading: loading })
                }
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
                hideCategoryModal={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
                hideCategorySubmodal={() => dispatch({ type: 'HIDE_CATEGORY_SUBMODAL' })}
                hideCategoryDeleteModal={() => dispatch({ type: 'HIDE_CATEGORY_DELETE_MODAL' })}
            />
            <ErrorMessage error={state.error.show} errorMessage={state.error.message} />
            <FallbackSpinner backdrop show={state.loading} />
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const SubWrapper = styled.div`
    margin-top: 1.25rem;
    max-width: 800px;
    padding: 20px;
    width: 100%;
`;

const NoTransactionsText = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 20px 0;
    opacity: 0.75;
`;

export default Transactions;
