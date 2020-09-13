// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import CategoryDropdown from './CategoryDropdown';
import Error from '../shared/Error';

// TYPES //
import { Transaction } from '../../types';

interface Props {
    mode: string;
    toggled: boolean;
    close: () => void;
    handleCreateTransaction: (transaction: Transaction) => void;
    handleEditMultipleTransactions: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const modalRef = useRef<HTMLInputElement>(null);
    const [transaction, setTransaction] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        category: '',
        amount: '',
    });
    const [error, setError] = useState({ show: false, message: '' });

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const parsedAmount = parseFloat(transaction.amount);
        if (!transaction.date) {
            setError({ show: true, message: 'Invalid date' });
        } else if (!transaction.description || !transaction.category || !transaction.amount) {
            setError({ show: true, message: 'All fields must be filled.' });
        } else if (isNaN(parsedAmount)) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (parsedAmount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            setTransaction({
                date: new Date().toISOString().slice(0, 10),
                description: '',
                category: '',
                amount: '',
            });
            if (props.mode === 'add') {
                props.handleCreateTransaction({ ...transaction, amount: parsedAmount });
            } else {
                props.handleEditMultipleTransactions({ ...transaction, amount: parsedAmount });
            }
            props.close();
        }
        errorTimeout = setTimeout(() => {
            setError(prevError => ({ ...prevError, show: false }));
        }, 3000);
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <Modal
            centered
            onShow={() => modalRef.current.focus()}
            onHide={() => props.close()}
            show={props.toggled}
        >
            <Error error={error.show} errorMessage={error.message} />
            <Form>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            className='form-control editor edit-date'
                            defaultValue={transaction.date}
                            onChange={e => setTransaction({ ...transaction, date: e.target.value })}
                            type='date'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    description: e.target.value,
                                })
                            }
                            ref={modalRef}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <CategoryDropdown
                            class='react-select-transaction-modal'
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    category: e.value,
                                })
                            }
                            openCallback={() => props.close()}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    amount: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => props.close()} size='sm' variant='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} size='sm' type='submit' variant='primary'>
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TransactionModal;
