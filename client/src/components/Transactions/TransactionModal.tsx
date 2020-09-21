// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import Dropdown from '../shared/Dropdown';
import ErrorMessage from '../shared/ErrorMessage';
import CategoryDropdownMenu from '../shared/CategoryDropdownMenu';

// TYPES //
import { Transaction, Category } from '../../types';

// UTILS //
import { parseCategoryDropdownOptions } from '../shared/TransactionUtil';

interface Props {
    mode: string;
    show: boolean;
    close: () => void;
    handleCreateTransaction: (transaction: Transaction) => void;
    handleEditMultipleTransactions: (transaction: Transaction) => void;
    categories: Category[];
    openCategory: () => void;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const TransactionModal: React.FC<Props> = props => {
    const modalRef = useRef<HTMLInputElement>(null);
    const [transaction, setTransaction] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        category: '',
        amount: '',
    });
    const [error, setError] = useState({ show: false, message: '' });

    useEffect(() => {
        window.onkeydown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Enter' && props.show) {
                handleSubmit(e);
            }
        };
    }, [props.show]);

    const handleSubmit = (e: any) => {
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
            handleClose();
            return;
        }
        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }
        errorTimeout = setTimeout(() => {
            setError(prevError => ({ ...prevError, show: false }));
        }, 3000);
    };

    const handleClose = () => {
        props.close();
        setTransaction({
            date: new Date().toISOString().slice(0, 10),
            description: '',
            category: '',
            amount: '',
        });
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
            onHide={handleClose}
            show={props.show}
        >
            <ErrorMessage error={error.show} errorMessage={error.message} />
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
                        <Dropdown
                            size='bg'
                            padded
                            options={parseCategoryDropdownOptions(props.categories)}
                            defaultOption={
                                props.mode === 'edit'
                                    ? {
                                          value: transaction.category,
                                          label: transaction.category,
                                      }
                                    : null
                            }
                            placeholder='Select Category...'
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    category: e.value,
                                })
                            }
                            menuComponent={(menuProps: any) => (
                                <CategoryDropdownMenu
                                    menuProps={menuProps}
                                    openCategoryModal={props.openCategory}
                                    openCallback={props.close}
                                />
                            )}
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
                    <Button onClick={handleClose} size='sm' variant='secondary'>
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
