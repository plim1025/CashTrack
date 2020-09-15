/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Modal, Form } from 'react-bootstrap';
import ErrorMessage from '../shared/ErrorMessage';
import Select from 'react-select';

// TYPES //
import { Category, Transaction } from '../../types';

// UTIL //
import { addAndUpdateCategory } from '../shared/TransactionUtil';

interface Props {
    setLoading: (loading: boolean) => void;
    toggled: boolean;
    close: () => void;
    mode: string;
    category?: Category;
    categories: Category[];
    transactions: Transaction[];
    setCategories: (categories: Category[]) => void;
    setTransactions: (transactions: Transaction[]) => void;
    openDeleteModal: () => void;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const CategoryModal: React.FC<Props> = props => {
    const modalRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState({ show: false, message: '' });
    const [category, setCategory] = useState({
        name: props.mode === 'edit' ? props.category.name : null,
        type: props.mode === 'edit' ? props.category.type : null,
    });

    useEffect(() => {
        if (!props.toggled) {
            setCategory({ name: null, type: null });
        } else if (props.toggled && props.mode === 'edit') {
            setCategory({ name: props.category.name, type: props.category.type });
        }
    }, [props.toggled]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!category.name || !category.type) {
            setError({ show: true, message: 'All fields must be filled in' });
        } else if (
            props.categories.find(item => item.name === category.name) &&
            (props.mode === 'add' || props.category.name !== category.name)
        ) {
            setError({ show: true, message: 'There is already a category with that name' });
        } else {
            props.setLoading(true);
            await addAndUpdateCategory(
                category.name,
                category.type,
                props.mode === 'edit' ? props.category.name : null,
                props.mode === 'edit'
                    ? props.transactions
                          .filter(transaction => transaction.category === props.category.name)
                          .map(transaction => transaction._id)
                    : null
            );
            if (props.mode === 'edit') {
                props.setTransactions([
                    ...props.transactions
                        .filter(transaction => transaction.category === props.category.name)
                        .map(transaction => ({ ...transaction, category: category.name })),
                    ...props.transactions.filter(
                        transaction => transaction.category !== props.category.name
                    ),
                ]);
                props.setCategories([
                    ...props.categories.filter(
                        (item: Category) => item.name !== props.category.name
                    ),
                    category,
                ]);
            } else {
                props.setCategories([...props.categories, category]);
            }
            props.setLoading(false);
            props.close();
            return;
        }
        if (errorTimeout) {
            clearTimeout(errorTimeout);
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
        <Modal centered show={props.toggled} onShow={() => modalRef.current.focus()}>
            <Form>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            ref={modalRef}
                            defaultValue={props.mode === 'edit' ? props.category.name : ''}
                            onChange={e => setCategory({ ...category, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Select
                            classNamePrefix='react-select'
                            className='react-select react-select-padded-modal'
                            options={[
                                {
                                    label: 'Expense',
                                    value: 'expense',
                                },
                                {
                                    label: 'Income',
                                    value: 'income',
                                },
                                {
                                    label: 'Other',
                                    value: 'other',
                                },
                            ]}
                            defaultValue={
                                props.mode === 'edit'
                                    ? {
                                          label: `${props.category.type
                                              .charAt(0)
                                              .toUpperCase()}${props.category.type.slice(1)}`,
                                          value: props.category.type,
                                      }
                                    : null
                            }
                            onChange={(e: any) => setCategory({ ...category, type: e.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {props.mode === 'edit' ? (
                        <Button
                            onClick={() => props.openDeleteModal()}
                            style={{ marginRight: 'auto' }}
                            size='sm'
                            variant='danger'
                        >
                            Delete
                        </Button>
                    ) : null}
                    <Button onClick={() => props.close()} size='sm' variant='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} size='sm' type='submit' variant='primary'>
                        Submit
                    </Button>
                </Modal.Footer>
                <ErrorMessage error={error.show} errorMessage={error.message} />
            </Form>
        </Modal>
    );
};

export default CategoryModal;
