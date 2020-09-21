/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Modal, Form } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import Dropdown from './Dropdown';

// TYPES //
import { Category, Transaction } from '../../types';

// UTIL //
import { createCategory, updateCategory } from './TransactionUtil';

interface Props {
    setLoading: (loading: boolean) => void;
    show: boolean;
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
        name: props.mode === 'edit' ? props.category.name : '',
        type: props.mode === 'edit' ? props.category.type : '',
    });

    useEffect(() => {
        if (!props.show) {
            setCategory({ name: null, type: null });
        } else if (props.show && props.mode === 'edit') {
            setCategory({ name: props.category.name, type: props.category.type });
        }
    }, [props.show]);

    useEffect(() => {
        window.onkeydown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Enter' && props.show) {
                handleSubmit(e);
            }
        };
    }, [category]);

    const handleSubmit = async (e: any) => {
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
            if (props.mode === 'edit') {
                await updateCategory(
                    props.category._id,
                    category.name,
                    category.type,
                    props.transactions
                        .filter(transaction => transaction.category === props.category.name)
                        .map(transaction => transaction._id)
                );
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
                const id = await createCategory(category.name, category.type);
                props.setCategories([...props.categories, { ...category, _id: id }]);
            }
            props.setLoading(false);
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
        setCategory({
            name: '',
            type: '',
        });
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    console.log(category);
    return (
        <Modal centered show={props.show} onShow={() => modalRef.current.focus()}>
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
                        <Dropdown
                            size='bg'
                            options={[
                                {
                                    label: 'Expenses',
                                    value: 'expenses',
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
                            defaultOption={
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
                    <Button onClick={handleClose} size='sm' variant='secondary'>
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
