// REACT //
import React, { useEffect, useReducer, useContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

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
import { Button } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext, HeaderContext } from '../App';

// TYPES //
import { Transaction, Category } from '../types';

// UTIL //
import {
    createTransaction,
    updateTransactions,
    deleteTransactions,
} from '../components/shared/TransactionUtil';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_SELECTED_TRANSACTION_IDS'; ids: string[] }
    | { type: 'SET_SELECTED_ACCOUNT_ID'; id: string }
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
    const { transactions, setTransactions, accounts } = useContext(ResourcesContext);
    const { setSubpage } = useContext(HeaderContext);

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
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

    const handleCreateTransaction = async (newTransaction: Transaction) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const createdTransaction = await createTransaction(newTransaction);
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
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
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
                    <AccountInfo accounts={accounts} selectedAccountID={state.selectedAccountID} />
                ) : null}
                <Buttons
                    showModal={() => dispatch({ type: 'SHOW_TRANSACTION_ADD_MODAL' })}
                    handleEditButton={handleEditButton}
                    handleDeleteButton={handleDeleteMultipleTransactions}
                />
                {!accounts.length ? (
                    <NoTransactionsText>
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
    max-width: 800px;
    padding: 20px;
    width: 100%;
`;

const NoTransactionsText = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    opacity: 0.75;
`;

export default withRouter(Transactions);
