// REACT //
import React, { useState, useEffect } from 'react';

// ROUTER //
import { withRouter } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadTransactions, deleteTransactions, logout } from '../redux/Actions';
import { RootState } from '../redux/Store';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Table from '../components/Transactions/Table';
import ModalOverlay from '../components/Transactions/ModalOverlay';
import { Button } from 'react-bootstrap';

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        width: '100%',
        margin: 'auto',
        padding: 20,
        maxWidth: 1000,
    },
    addButton: {
        marginBottom: 20,
    },
    deleteButton: {
        marginBottom: 20,
    },
});

interface Props {
    history: any;
}

const Transactions: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const stateTransactions = useSelector((state: RootState) => state.transactions);
    const [transactions, setTransactions] = useState(null);
    const [selectedTransactionIDs, setSelectedTransactionIDs] = useState([]);
    const [modal, setModal] = useState(false);

    const getTransactionData = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                credentials: 'include',
            });
            if (response.status === 500) {
                dispatch(logout(props.history));
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

    useEffect(() => {
        setTransactions(stateTransactions);
    }, [stateTransactions]);

    const handleDeleteTransactions = () => {
        setTransactions(
            transactions.filter(
                (transaction: any) => selectedTransactionIDs.indexOf(transaction._id) === -1
            )
        );
        dispatch(deleteTransactions(selectedTransactionIDs));
    };

    if (!transactions) {
        if (stateTransactions) {
            setTransactions(stateTransactions);
        } else {
            const promise = getTransactionData().then(data => {
                setTransactions(data);
                dispatch(loadTransactions(data));
            });
            throw promise;
        }
    }
    return (
        <div className={css(ss.wrapper)}>
            <Button block onClick={() => setModal(true)} className={css(ss.addButton)}>
                Add Transaction
            </Button>
            <Button
                variant='danger'
                block
                onClick={handleDeleteTransactions}
                className={css(ss.deleteButton)}
            >
                Delete Transactions
            </Button>
            <Table
                transactions={transactions}
                selectedTransactionIDs={selectedTransactionIDs}
                setSelectedTransactionIDs={setSelectedTransactionIDs}
            />
            <ModalOverlay toggled={modal} toggle={setModal} />
        </div>
    );
};

export default withRouter(Transactions);
