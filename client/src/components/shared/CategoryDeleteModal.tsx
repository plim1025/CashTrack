/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { Button, Modal } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Category } from '../../types';

// UTIL //
import { deleteCategory } from './SharedUtils';

interface Props {
    setLoading: (loading: boolean) => void;
    show: boolean;
    close: () => void;
    category: Category;
}

const CategoryModal: React.FC<Props> = props => {
    const { transactions, setTransactions, categories, setCategories } = useContext(
        ResourcesContext
    );

    const handleSubmit = async () => {
        const transactionIDsToModify = transactions
            .filter(transaction => transaction.category === props.category.name)
            .map(transaction => transaction._id);
        props.setLoading(true);
        await deleteCategory(props.category._id, transactionIDsToModify);
        setCategories(categories.filter(category => category.name !== props.category.name));
        setTransactions([
            ...transactions
                .filter(transaction => transaction.category === props.category.name)
                .map(transaction => ({ ...transaction, category: 'Uncategorized' })),
            ...transactions.filter(transaction => transaction.category !== props.category.name),
        ]);
        props.setLoading(false);
        props.close();
    };

    return (
        <Modal centered show={props.show}>
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
