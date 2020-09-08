// REACT //
import React, { useEffect, useState } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useDispatch } from 'react-redux';
import { loadSubpage } from '../redux/Actions';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Table from '../components/Transactions/Table';
import ModalOverlay from '../components/Transactions/ModalOverlay';
import Sidebar from '../components/Transactions/Sidebar';
import AccountInfo from '../components/Transactions/AccountInfo';
import { Button } from 'react-bootstrap';

// TYPES //
import { Transaction, Resources } from '../types';

interface Props {
    resources: Resources;
    refreshResources: () => void;
}

const Transactions: React.FC<Props & RouteComponentProps> = props => {
    const dispatch = useDispatch();
    const [transactions, setTransactions] = useState(props.resources.transactions.read());
    const [accounts, setAccounts] = useState(props.resources.accounts.read());
    const [modal, setModal] = useState(false);
    const [selectedAccountID, setselectedAccountID] = useState('All Accounts');
    const [selectedTransactionIDs, setSelectedTransactionIDs] = useState([]);

    useEffect(() => {
        if (transactions) {
            setTransactions(
                transactions.map((transaction: Transaction) => {
                    if (
                        transaction.accountID === selectedAccountID ||
                        selectedAccountID === 'All Accounts'
                    ) {
                        return { ...transaction, selected: true };
                    }
                    return { ...transaction, selected: false };
                })
            );
        }
    }, [selectedAccountID]);

    useEffect(() => {
        setTransactions(props.resources.transactions.read());
        setAccounts(props.resources.accounts.read());
    }, [props.resources]);

    const handleCreateTransaction = async (transaction: Transaction) => {
        try {
            const transactionInfo = JSON.stringify({
                description: transaction.description,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
            });
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
            const id = await response.json();
            setTransactions([...transactions, { ...transaction, _id: id, selected: true }]);
        } catch (error) {
            throw Error(`Error creating transaction: ${error}`);
        }
    };

    const handleDeleteTransaction = async () => {
        setTransactions(
            transactions.filter(
                (transaction: Transaction) => selectedTransactionIDs.indexOf(transaction._id) === -1
            )
        );
        setSelectedTransactionIDs([]);
        try {
            const transactionInfo = JSON.stringify(selectedTransactionIDs);
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: transactionInfo,
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
        } catch (error) {
            console.log(`Error deleting transaction: ${error}`);
        }
    };

    const navigateToAccountsPage = () => {
        props.history.push('/accounts');
        dispatch(loadSubpage('accounts'));
    };

    return (
        <div className={css(ss.wrapper)}>
            <Sidebar
                accounts={accounts}
                selectedAccountID={selectedAccountID}
                setSelectedAccountID={setselectedAccountID}
            />
            <div className={css(ss.subWrapper)}>
                {accounts.length ? (
                    <AccountInfo accounts={accounts} selectedAccountID={selectedAccountID} />
                ) : null}
                <div className={css(ss.buttons)}>
                    <Button onClick={() => setModal(true)} className={css(ss.button)}>
                        + Add
                    </Button>
                    <Button
                        variant='danger'
                        onClick={handleDeleteTransaction}
                        className={css(ss.button)}
                    >
                        <svg className={css(ss.icon)} viewBox='-48 0 407 407'>
                            <path d='m89.199219 37c0-12.132812 9.46875-21 21.601562-21h88.800781c12.128907 0 21.597657 8.867188 21.597657 21v23h16v-23c0-20.953125-16.644531-37-37.597657-37h-88.800781c-20.953125 0-37.601562 16.046875-37.601562 37v23h16zm0 0' />
                            <path d='m60.601562 407h189.199219c18.242188 0 32.398438-16.046875 32.398438-36v-247h-254v247c0 19.953125 14.15625 36 32.402343 36zm145.597657-244.800781c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm0 0' />
                            <path d='m20 108h270.398438c11.046874 0 20-8.953125 20-20s-8.953126-20-20-20h-270.398438c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20zm0 0' />
                        </svg>
                        Delete
                    </Button>
                    <Button
                        variant='success'
                        onClick={() => props.refreshResources()}
                        className={css(ss.button)}
                    >
                        <svg className={css(ss.icon)} viewBox='0 0 512 512'>
                            <path d='M493.815,70.629c-11.001-1.003-20.73,7.102-21.733,18.102l-2.65,29.069C424.473,47.194,346.429,0,256,0 C158.719,0,72.988,55.522,30.43,138.854c-5.024,9.837-1.122,21.884,8.715,26.908c9.839,5.024,21.884,1.123,26.908-8.715 C102.07,86.523,174.397,40,256,40c74.377,0,141.499,38.731,179.953,99.408l-28.517-20.367c-8.989-6.419-21.48-4.337-27.899,4.651 c-6.419,8.989-4.337,21.479,4.651,27.899l86.475,61.761c12.674,9.035,30.155,0.764,31.541-14.459l9.711-106.53 C512.919,81.362,504.815,71.632,493.815,70.629z' />
                            <path d='M472.855,346.238c-9.838-5.023-21.884-1.122-26.908,8.715C409.93,425.477,337.603,472,256,472 c-74.377,0-141.499-38.731-179.953-99.408l28.517,20.367c8.989,6.419,21.479,4.337,27.899-4.651 c6.419-8.989,4.337-21.479-4.651-27.899l-86.475-61.761c-12.519-8.944-30.141-0.921-31.541,14.459l-9.711,106.53 c-1.003,11,7.102,20.73,18.101,21.733c11.014,1.001,20.731-7.112,21.733-18.102l2.65-29.069C87.527,464.806,165.571,512,256,512 c97.281,0,183.012-55.522,225.57-138.854C486.594,363.309,482.692,351.262,472.855,346.238z' />
                        </svg>
                        Refresh
                    </Button>
                </div>
                {!accounts.length ? (
                    <div className={css(ss.noTransactionsText)}>
                        <span>No accounts added.</span>
                        <Button variant='link' onClick={navigateToAccountsPage}>
                            Link an account.
                        </Button>
                    </div>
                ) : null}
                <Table
                    transactions={transactions.filter(
                        (transaction: Transaction) => transaction.selected
                    )}
                    selectedTransactionIDs={selectedTransactionIDs}
                    setSelectedTransactionIDs={setSelectedTransactionIDs}
                />
                <ModalOverlay
                    toggled={modal}
                    toggle={() => setModal(false)}
                    handleCreateTransaction={handleCreateTransaction}
                />
            </div>
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
    },
    subWrapper: {
        width: '100%',
        padding: 20,
        maxWidth: 800,
    },
    buttons: {
        display: 'flex',
    },
    button: {
        // @ts-ignore
        display: 'flex !important',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 20,
        lineHeight: '1 !important',
    },
    icon: {
        fill: '#fff',
        height: 16,
        width: 16,
        marginRight: 5,
    },
    noTransactionsText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default withRouter(Transactions);
