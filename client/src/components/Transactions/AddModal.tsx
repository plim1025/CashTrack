// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import Error from '../shared/Error';

// TYPES //
import { Transaction } from '../../types';

interface Props {
    mode: string;
    toggled: boolean;
    toggle: (toggle: boolean) => void;
    handleCreateTransaction: (transaction: Transaction) => void;
    handleEditMultipleTransactions: (transaction: Transaction) => void;
}

const AddModal: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const modalRef = useRef<HTMLInputElement>(null);
    const [transaction, setTransaction] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        category: '',
        amount: 0,
    });
    const [error, setError] = useState({ show: false, message: '' });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!transaction.date) {
            setError({ show: true, message: 'Invalid date' });
        } else if (isNaN(transaction.amount) || !transaction.amount) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (transaction.amount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            setTransaction({
                date: new Date().toISOString().slice(0, 10),
                description: '',
                category: '',
                amount: 0,
            });
            if (props.mode === 'add') {
                props.handleCreateTransaction(transaction);
            } else {
                props.handleEditMultipleTransactions(transaction);
            }
            props.toggle(false);
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
            onHide={() => props.toggle(false)}
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
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    category: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    amount: parseFloat(e.target.value),
                                })
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => props.toggle(false)} size='sm' variant='secondary'>
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

export default AddModal;
