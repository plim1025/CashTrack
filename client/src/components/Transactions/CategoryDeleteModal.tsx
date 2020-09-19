/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import { Button, Modal } from 'react-bootstrap';

// TYPES //
import { Transaction, Category } from '../../types';

// UTIL //
import { deleteCategory } from '../shared/TransactionUtil';

interface Props {
    setLoading: (loading: boolean) => void;
    toggled: boolean;
    close: () => void;
    category: Category;
    categories: Category[];
    transactions: Transaction[];
    setCategories: (categories: Category[]) => void;
    setTransactions: (transactions: Transaction[]) => void;
}

const CategoryModal: React.FC<Props> = props => {
    const handleSubmit = async () => {
        const transactionIDsToModify = props.transactions
            .filter(transaction => transaction.category === props.category.name)
            .map(transaction => transaction._id);
        props.setLoading(true);
        await deleteCategory(props.category._id, transactionIDsToModify);
        props.setCategories(
            props.categories.filter(category => category.name !== props.category.name)
        );
        props.setTransactions([
            ...props.transactions
                .filter(transaction => transaction.category === props.category.name)
                .map(transaction => ({ ...transaction, category: 'Uncategorized' })),
            ...props.transactions.filter(
                transaction => transaction.category !== props.category.name
            ),
        ]);
        props.setLoading(false);
        props.close();
    };

    return (
        <Modal centered show={props.toggled}>
            <Modal.Body>
                <div>Are you sure you want to delete this category?</div>
                <div style={{ marginTop: 10 }}>
                    Transactions with this category will be marked as &apos;Uncategorized&apos;
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.close()} variant='secondary' size='sm'>
                    Cancel
                </Button>
                <br />
                <Button onClick={handleSubmit} variant='danger' size='sm'>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryModal;
