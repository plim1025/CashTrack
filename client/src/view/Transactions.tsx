// REACT //
import React, { useEffect, useReducer } from 'react';

// ROUTER //
import { withRouter } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import {
    loadSubpage,
    loadTransactions,
    loadAccounts,
    deleteTransactions,
    logout,
} from '../redux/Actions';
import { RootState } from '../redux/Store';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Table from '../components/Transactions/Table';
import ModalOverlay from '../components/Transactions/ModalOverlay';
import Sidebar from '../components/Transactions/Sidebar';
import { Button } from 'react-bootstrap';

interface Props {
    history: any;
}

enum ACTIONS {
    SET_ACCOUNTS = 'SET_ACCOUNTS',
    SET_TRANSACTIONS = 'SET_TRANSACTIONS',
    SET_TRANSACTION_IDS = 'SET_TRANSACTION_IDS',
    DELETE_TRANSACTIONS = 'DELETE_TRANSACTIONS',
    SET_LOADING = 'SET_LOADING',
    SET_LOADED = 'SET_LOADED',
    SHOW_MODAL = 'SHOW_MODAL',
    HIDE_MODAL = 'HIDE_MODAL',
    SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT',
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTIONS.SET_ACCOUNTS:
            return { ...state, accounts: action.accounts };
        case ACTIONS.SET_TRANSACTIONS:
            return { ...state, transactions: action.transactions };
        case ACTIONS.SET_TRANSACTION_IDS:
            return { ...state, selectedTransactionIDs: action.transactionIDs };
        case ACTIONS.DELETE_TRANSACTIONS:
            return {
                ...state,
                transactions: state.transactions.filter(
                    (transaction: any) =>
                        state.selectedTransactionIDs.indexOf(transaction._id) === -1
                ),
            };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: true };
        case ACTIONS.SET_LOADED:
            return { ...state, loading: false };
        case ACTIONS.SHOW_MODAL:
            return { ...state, modal: true };
        case ACTIONS.HIDE_MODAL:
            return { ...state, modal: false };
        case ACTIONS.SET_SELECTED_ACCOUNT:
            return { ...state, selectedAccount: action.selectedAccount };
        default:
            return state;
    }
};

const Transactions: React.FC<Props> = props => {
    const globalDispatch = useDispatch();
    const [state, localDispatch] = useReducer(reducer, {
        transactions: [],
        selectedTransactionIDs: [],
        accounts: [],
        loaded: false,
        modal: false,
        selectedAccount: 'All Accounts',
    });
    const reduxTransactions = useSelector((redux: RootState) => redux.transactions);
    const reduxAccounts = useSelector((redux: RootState) => redux.accounts);

    const getTransactionData = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                credentials: 'include',
            });
            if (response.status === 500) {
                globalDispatch(logout(props.history));
            }
            const parsedResponse = await response.json();
            if (parsedResponse.length) {
                const typedResponse = parsedResponse.map((transaction: any) => {
                    const date = new Date(transaction.date);
                    date.setDate(date.getDate() + 1);
                    const dateString = `${
                        date.getMonth() + 1
                    }/${date.getDate()}/${date.getFullYear()}`;
                    return {
                        ...transaction,
                        date: dateString,
                        amount: transaction.amount.toFixed(2),
                    };
                });
                return typedResponse;
            }
            return [];
        } catch (error) {
            console.log(`Error setting plaid transactions: ${error}`);
            return [];
        }
    };

    const getAccountData = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount`, {
                credentials: 'include',
            });
            if (response.status === 500) {
                globalDispatch(logout(props.history));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const parsedResponse = await response.json();
            if (parsedResponse.length) {
                const typedResponse = parsedResponse.map(({ batchID, ...account }: any) => account);
                return typedResponse;
            }
            return [];
        } catch (error) {
            console.log(`Error setting plaid accounts: ${error}`);
            return [];
        }
    };

    useEffect(() => {
        localDispatch({ type: ACTIONS.SET_TRANSACTIONS, transactions: reduxTransactions });
    }, [reduxTransactions]);

    useEffect(() => {
        localDispatch({ type: ACTIONS.SET_ACCOUNTS, accounts: reduxAccounts });
    }, [reduxAccounts]);

    const handleDeleteTransactions = () => {
        localDispatch({ type: ACTIONS.DELETE_TRANSACTIONS });
        globalDispatch(deleteTransactions(state.selectedTransactionIDs));
    };

    const navigateToAccountsPage = () => {
        props.history.push('/accounts');
        globalDispatch(loadSubpage('accounts'));
    };

    if (!state.transactions) {
        if (reduxTransactions) {
            localDispatch({ type: ACTIONS.SET_TRANSACTIONS, transactions: reduxTransactions });
        } else if (reduxAccounts) {
            localDispatch({ type: ACTIONS.SET_ACCOUNTS, accounts: reduxAccounts });
        } else {
            const promise = Promise.all([getTransactionData(), getAccountData()]).then(
                ([transactionData, accountData]: any) => {
                    localDispatch({
                        type: ACTIONS.SET_TRANSACTIONS,
                        transactions: transactionData,
                    });
                    localDispatch({ type: ACTIONS.SET_ACCOUNTS, accountData });
                    globalDispatch(loadTransactions(transactionData));
                    globalDispatch(loadAccounts(accountData));
                }
            );
            throw promise;
        }
    }
    return (
        <div className={css(ss.wrapper)}>
            <Sidebar
                accounts={state.accounts || []}
                selectedAccount={state.selectedAccount}
                setSelectedAccount={(selectedAccount: string) =>
                    localDispatch({
                        type: ACTIONS.SET_SELECTED_ACCOUNT,
                        selectedAccount: selectedAccount,
                    })
                }
            />
            <div className={css(ss.subWrapper)}>
                <div className={css(ss.buttons)}>
                    <Button
                        onClick={() => localDispatch({ type: ACTIONS.SHOW_MODAL })}
                        className={css(ss.addButton)}
                    >
                        Add Transaction
                    </Button>
                    <Button
                        variant='danger'
                        onClick={handleDeleteTransactions}
                        className={css(ss.deleteButton)}
                    >
                        Delete Transactions
                    </Button>
                </div>
                <Table
                    transactions={state.transactions}
                    selectedTransactionIDs={state.selectedTransactionIDs}
                    setSelectedTransactionIDs={(transactionIDs: string[]) =>
                        localDispatch({
                            type: ACTIONS.SET_TRANSACTION_IDS,
                            transactionIDs: transactionIDs,
                        })
                    }
                />
                <ModalOverlay
                    toggled={state.modal}
                    toggle={() => localDispatch({ type: ACTIONS.HIDE_MODAL })}
                />
                {state.transactions && !state.transactions.length ? (
                    <div className={css(ss.noTransactionsText)}>
                        <span>No transactions added.</span>
                        <Button variant='link' onClick={navigateToAccountsPage}>
                            Link an account.
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {},
    subWrapper: {
        width: '100%',
        margin: 'auto',
        padding: 20,
        maxWidth: 1000,
    },
    buttons: {
        display: 'flex',
    },
    addButton: {
        flex: 1,
        margin: 20,
        marginTop: 0,
    },
    deleteButton: {
        flex: 1,
        margin: 20,
        marginTop: 0,
    },
    noTransactionsText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default withRouter(Transactions);
