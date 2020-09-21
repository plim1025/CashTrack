// REACT //
import React, { useState, useEffect, KeyboardEvent } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Modal, Button, Form } from 'react-bootstrap';
import Dropdown from '../shared/Dropdown';
import ErrorMessage from '../shared/ErrorMessage';
import CategoryDropdownMenu from '../shared/CategoryDropdownMenu';

// TYPES //
import { Budget, Category } from '../../types';

// UTILS //
import { parseCategoryDropdownOptions } from '../shared/TransactionUtil';
import { getFrequencyLabel } from '../shared/BudgetUtils';

interface Props {
    show: boolean;
    mode: string;
    budget: Budget;
    close: () => void;
    openCategory: () => void;
    categories: Category[];
    handleCreateBudget: (budget: Budget) => void;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const BudgetModal: React.FC<Props> = props => {
    const [budget, setBudget] = useState({
        frequency: props.mode === 'edit' ? props.budget.frequency : '',
        startDate:
            props.mode === 'edit' && props.budget.frequency === 'one-time'
                ? new Date(props.budget.startDate).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
        endDate:
            props.mode === 'edit' && props.budget.frequency === 'one-time'
                ? new Date(props.budget.endDate).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
        amount: props.mode === 'edit' ? props.budget.amount.toFixed(2) : '',
        categoryName: props.mode === 'edit' ? props.budget.categoryName : '',
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
        const parsedAmount = parseFloat(budget.amount);
        if (budget.frequency === 'one-time' && !budget.startDate && !budget.endDate) {
            setError({ show: true, message: 'Invalid date' });
        } else if (budget.startDate > budget.endDate) {
            setError({ show: true, message: 'Start date must be before end date of purchase' });
        } else if (!budget.frequency || !budget.amount || !budget.categoryName) {
            setError({ show: true, message: 'All fields must be filled.' });
        } else if (isNaN(parsedAmount)) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (parsedAmount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            props.handleCreateBudget({ ...budget, amount: parsedAmount });
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
        setBudget({
            frequency: '',
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            amount: '',
            categoryName: '',
        });
    };

    return (
        <Modal centered onHide={handleClose} show={props.show}>
            <ErrorMessage error={error.show} errorMessage={error.message} />
            <Form>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Dropdown
                            size='bg'
                            padded
                            options={parseCategoryDropdownOptions(props.categories)}
                            defaultOption={
                                props.mode === 'edit'
                                    ? {
                                          value: budget.categoryName,
                                          label: budget.categoryName,
                                      }
                                    : null
                            }
                            onChange={e =>
                                setBudget({
                                    ...budget,
                                    categoryName: e.value,
                                })
                            }
                            placeholder='Select Category...'
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
                                setBudget({
                                    ...budget,
                                    amount: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Frequency</Form.Label>
                        <Dropdown
                            size='bg'
                            padded
                            options={[
                                {
                                    label: 'Daily',
                                    value: 'day',
                                },
                                {
                                    label: 'Weekly',
                                    value: 'week',
                                },
                                {
                                    label: 'Monthly',
                                    value: 'month',
                                },
                                {
                                    label: 'Yearly',
                                    value: 'year',
                                },
                                {
                                    label: 'One Time Purchase',
                                    value: 'one-time',
                                },
                            ]}
                            placeholder='Select Frequency...'
                            defaultOption={
                                props.mode === 'edit'
                                    ? {
                                          label: getFrequencyLabel(props.budget.frequency),
                                          value: props.budget.frequency,
                                      }
                                    : null
                            }
                            onChange={(e: any) => setBudget({ ...budget, frequency: e.value })}
                        />
                    </Form.Group>
                    {budget.frequency === 'one-time' ? (
                        <DateWrapper>
                            <Form.Group>
                                <Form.Label>Start Saving</Form.Label>
                                <Form.Control
                                    className='form-control editor edit-date'
                                    defaultValue={budget.startDate}
                                    onChange={e =>
                                        setBudget({ ...budget, startDate: e.target.value })
                                    }
                                    type='date'
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Purchase Date</Form.Label>
                                <Form.Control
                                    className='form-control editor edit-date'
                                    defaultValue={budget.endDate}
                                    onChange={e =>
                                        setBudget({ ...budget, endDate: e.target.value })
                                    }
                                    type='date'
                                />
                            </Form.Group>
                        </DateWrapper>
                    ) : null}
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

const DateWrapper = styled.div`
    display: flex;
    & div:first-child {
        margin-right: 10px;
    }
`;

export default BudgetModal;
