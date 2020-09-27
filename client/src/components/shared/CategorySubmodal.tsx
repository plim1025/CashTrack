/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useEffect, useRef, useContext } from 'react';

// COMPONENTS //
import { Modal, Form } from 'react-bootstrap';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import Dropdown from './Dropdown';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Category } from '../../types';

// UTIL //
import { createCategory, updateCategory } from './SharedUtils';

interface Props {
    setLoading: (loading: boolean) => void;
    show: boolean;
    close: () => void;
    mode: string;
    category?: Category;
    openDeleteModal: () => void;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const CategoryModal: React.FC<Props> = props => {
    const { transactions, setTransactions, categories, setCategories } = useContext(
        ResourcesContext
    );
    const modalRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState({ show: false, message: '' });
    const [category, setCategory] = useState<Category>(null);

    useEffect(() => {
        if (props.show && props.mode === 'edit') {
            setCategory(props.category);
        }
    }, [props.show]);

    const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (!category || !category.name || !category.type) {
            setError({ show: true, message: 'All fields must be filled in' });
        } else if (
            categories.find(item => item.name === category.name) &&
            (props.mode === 'add' || props.category.name !== category.name)
        ) {
            setError({ show: true, message: 'There is already a category with that name' });
        } else {
            props.setLoading(true);
            if (props.mode === 'edit') {
                const updatedCategory = await updateCategory(
                    props.category._id,
                    category.name,
                    category.type,
                    transactions
                        .filter(transaction => transaction.category === props.category.name)
                        .map(transaction => transaction._id)
                );
                setTransactions([
                    ...transactions
                        .filter(transaction => transaction.category === props.category.name)
                        .map(transaction => ({ ...transaction, category: category.name })),
                    ...transactions.filter(
                        transaction => transaction.category !== props.category.name
                    ),
                ]);
                setCategories([
                    ...categories.filter(item => item.name !== props.category.name),
                    updatedCategory,
                ]);
            } else {
                const newCategory = await createCategory(category.name, category.type);
                setCategories([...categories, newCategory]);
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
        setCategory(null);
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

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
                            padded
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
                            onChange={e => setCategory({ ...category, type: e.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {props.mode === 'edit' ? (
                        <Button
                            child='Delete'
                            onClick={() => props.openDeleteModal()}
                            style={{ marginRight: 'auto' }}
                            size='sm'
                            variant='danger'
                        />
                    ) : null}
                    <Button child='Cancel' onClick={handleClose} size='sm' variant='secondary' />
                    <Button
                        child='Submit'
                        onClick={handleSubmit}
                        size='sm'
                        variant='primary'
                        submit
                    />
                </Modal.Footer>
                <ErrorMessage error={error.show} errorMessage={error.message} />
            </Form>
        </Modal>
    );
};

export default CategoryModal;
