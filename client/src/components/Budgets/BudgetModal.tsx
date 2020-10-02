// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Modal, Form } from 'react-bootstrap';
import Button from '../shared/Button';
import Dropdown from '../shared/Dropdown';
import ErrorMessage from '../shared/ErrorMessage';
import CategoryDropdownMenu from '../shared/CategoryDropdownMenu';

// TYPES //
import { Budget, Category } from '../../types';

// UTILS //
import { parseCategoryDropdownOptions } from '../shared/SharedUtils';
import { getFrequencyLabel, generateDateMonths, getDefaultDateMonth } from './BudgetUtils';

interface Props {
    show: boolean;
    mode: string;
    budget: Budget;
    close: () => void;
    openCategory: () => void;
    categories: Category[];
    handleCreateBudget: (budget: Budget) => void;
    handleEditBudget: (budgetID: string, budget: Budget) => void;
    handleDeleteBudget: (budgetID: string) => void;
    monthDate: Date;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const BudgetModal: React.FC<Props> = props => {
    const [budget, setBudget] = useState<Budget>(null);
    const [error, setError] = useState({ show: false, message: '' });

    useEffect(() => {
        if (props.show) {
            if (props.mode === 'edit') {
                setBudget(props.budget);
            } else {
                setBudget({
                    _id: null,
                    frequency: null,
                    startDate: getDefaultDateMonth(props.monthDate, props.mode, 'start').value,
                    endDate: getDefaultDateMonth(props.monthDate, props.mode, 'end').value,
                    amount: null,
                    categoryName: null,
                });
            }
        }
    }, [props.show]);

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (
            !budget ||
            !budget.frequency ||
            budget.amount == null ||
            !budget.categoryName ||
            !budget.startDate ||
            !budget.endDate
        ) {
            setError({ show: true, message: 'All fields must be filled.' });
        } else if (budget.startDate > budget.endDate) {
            setError({ show: true, message: 'Start date must be before end date' });
        } else if (isNaN(budget.amount)) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (budget.amount < 0) {
            setError({ show: true, message: 'Budget cannot be less than $0' });
        } else if (budget.amount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            if (props.mode === 'add') {
                props.handleCreateBudget(budget);
            } else {
                props.handleEditBudget(props.budget._id, budget);
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
        setBudget({
            _id: null,
            frequency: null,
            startDate: getDefaultDateMonth(props.monthDate, props.mode, 'start').value,
            endDate: getDefaultDateMonth(props.monthDate, props.mode, 'end').value,
            amount: null,
            categoryName: null,
        });
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

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
                                          value: props.budget.categoryName,
                                          label: props.budget.categoryName,
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
                            defaultValue={props.mode === 'edit' ? props.budget.amount : null}
                            onChange={e =>
                                setBudget({
                                    ...budget,
                                    amount: parseFloat(e.target.value),
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
                            onChange={e => setBudget({ ...budget, frequency: e.value })}
                        />
                    </Form.Group>
                    <DateWrapper>
                        <Form.Group>
                            <Form.Label>Start Month</Form.Label>
                            <Dropdown
                                size='bg'
                                padded
                                options={generateDateMonths(props.monthDate)}
                                placeholder='Select date...'
                                defaultOption={getDefaultDateMonth(
                                    props.monthDate,
                                    props.mode,
                                    'start'
                                )}
                                onChange={e => setBudget({ ...budget, startDate: e.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Month</Form.Label>
                            <Dropdown
                                size='bg'
                                padded
                                options={generateDateMonths(props.monthDate)}
                                placeholder='Select date...'
                                defaultOption={getDefaultDateMonth(
                                    props.monthDate,
                                    props.mode,
                                    'end'
                                )}
                                onChange={e => setBudget({ ...budget, endDate: e.value })}
                            />
                        </Form.Group>
                    </DateWrapper>
                </Modal.Body>
                <Modal.Footer>
                    {props.mode === 'edit' ? (
                        <Button
                            child='Delete'
                            onClick={() => {
                                props.handleDeleteBudget(props.budget._id);
                                props.close();
                            }}
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
            </Form>
        </Modal>
    );
};

// STYLES //
const DateWrapper = styled.div`
    display: flex;
    & > div {
        width: 50%;
    }
    & div:first-child {
        margin-right: 10px;
    }
`;

export default BudgetModal;
