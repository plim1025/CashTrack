// REACT //
import React, { useState, useEffect, useRef, useContext } from 'react';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import Dropdown from '../shared/Dropdown';
import ErrorMessage from '../shared/ErrorMessage';
import CategoryDropdownMenu from '../shared/CategoryDropdownMenu';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Transaction } from '../../types';

// UTILS //
import { DateString, parseCategoryDropdownOptions } from '../shared/SharedUtils';

interface Props {
    mode: string;
    show: boolean;
    close: () => void;
    handleCreateTransaction: (transaction: Transaction) => void;
    handleEditMultipleTransactions: (transaction: Transaction) => void;
    openCategory: () => void;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const TransactionModal: React.FC<Props> = props => {
    const { categories } = useContext(ResourcesContext);
    const modalRef = useRef<HTMLInputElement>(null);
    const [transaction, setTransaction] = useState<Transaction>({
        date: new Date(),
        _id: null,
        description: null,
        category: null,
        amount: null,
        accountID: null,
        categoryID: null,
        type: null,
    });
    const [error, setError] = useState({ show: false, message: '' });

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (
            !transaction ||
            !transaction.date ||
            !transaction.description ||
            !transaction.category ||
            transaction.amount == null
        ) {
            setError({ show: true, message: 'All fields must be filled.' });
        } else if (isNaN(transaction.amount)) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (transaction.amount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            if (props.mode === 'add') {
                props.handleCreateTransaction(transaction);
            } else {
                props.handleEditMultipleTransactions(transaction);
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
            date: new Date(),
            _id: null,
            description: null,
            category: null,
            amount: null,
            accountID: null,
            categoryID: null,
            type: null,
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
                            defaultValue={DateString()}
                            onChange={e =>
                                setTransaction({ ...transaction, date: new Date(e.target.value) })
                            }
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
                            options={parseCategoryDropdownOptions(categories)}
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
                                    amount: parseFloat(e.target.value),
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
