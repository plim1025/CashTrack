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
import { parseCategoryDropdownOptions } from '../shared/SharedUtils';
import { getFrequencyLabel, generateDateMonths, getDefaultDateMonth } from '../shared/BudgetUtils';

interface Props {
    show: boolean;
    mode: string;
    budget: Budget;
    close: () => void;
    openCategory: () => void;
    categories: Category[];
    handleCreateBudget: (budget: Budget) => void;
    // handleDeleteBudget: (budgetID: string) => void;
    monthDate: Date;
}

let errorTimeout: ReturnType<typeof setTimeout>;

const BudgetModal: React.FC<Props> = props => {
    const [budget, setBudget] = useState<Budget>(props.mode === 'edit' ? props.budget : null);
    const [error, setError] = useState({ show: false, message: '' });

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (
            !budget ||
            !budget.frequency ||
            !budget.amount ||
            !budget.categoryName ||
            !budget.startDate ||
            !budget.endDate
        ) {
            setError({ show: true, message: 'All fields must be filled.' });
        } else if (budget.startDate > budget.endDate) {
            setError({ show: true, message: 'Start date must be before end date of purchase' });
        } else if (isNaN(budget.amount)) {
            setError({ show: true, message: 'Amount should be numeric' });
        } else if (budget.amount > 1000000000) {
            setError({ show: true, message: 'Maximum amount is $1,000,000,000' });
        } else {
            if (props.mode === 'add') {
                // props.handleCreateBudget({ ...budget, amount: budget.amount });
            } else {
                // props.handleEditBudget({});
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
        setBudget(null);
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
                    <Button onClick={() => handleSubmit} size='sm' variant='danger'>
                        Delete
                    </Button>
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
    & > div {
        width: 50%;
    }
    & div:first-child {
        margin-right: 10px;
    }
`;

export default BudgetModal;
