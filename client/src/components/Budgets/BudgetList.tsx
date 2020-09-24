/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { ProgressBar, Button } from 'react-bootstrap';
import ViewModal from '../shared/ViewModal';

// TYPES //
import { Budget, Transaction, Category } from '../../types';

// UTILS //
import { parseTotalBudget } from '../shared/BudgetUtils';

interface Props {
    budgets: Budget[];
    transactions: Transaction[];
    categories: Category[];
    monthDate: Date;
    openEditModal: (newBudget: Budget) => void;
}

const BudgetList: React.FC<Props> = props => {
    const [viewModal, setViewModal] = useState({ show: false, transactions: [], title: '' });

    // console.log(viewModal.transactions);
    return (
        <>
            {props.budgets.length ? (
                props.budgets.map(budget => {
                    const transactionType = props.categories.find(
                        category => category.name === budget.categoryName
                    ).type;
                    let totalSpent = 0;
                    const categoryTransactions: Transaction[] = [];
                    props.transactions.forEach(transaction => {
                        const transactionDate = new Date(transaction.date);
                        const budgetDate = new Date(props.monthDate);
                        if (
                            transaction.category === budget.categoryName &&
                            transactionDate.getFullYear() === budgetDate.getFullYear() &&
                            transactionDate.getMonth() === budgetDate.getMonth()
                        ) {
                            totalSpent += transaction.amount;
                            categoryTransactions.push(transaction);
                        }
                    });
                    if (transactionType === 'expenses') {
                        totalSpent *= -1;
                    }
                    const totalBudget = parseTotalBudget(
                        budget,
                        totalSpent,
                        new Date(props.monthDate)
                    );
                    let budgetProgress = (totalSpent / totalBudget) * 100;
                    if (budgetProgress < 0) {
                        budgetProgress = 0;
                    } else if (budgetProgress > 100) {
                        budgetProgress = 100;
                    }
                    return (
                        <BudgetWrapper key={budget._id}>
                            <BudgetCategory>{budget.categoryName}</BudgetCategory>
                            <BudgetSubWrapper>
                                <ProgressBarWrapper
                                    striped
                                    now={budgetProgress}
                                    variant={
                                        budgetProgress < 50
                                            ? 'success'
                                            : budgetProgress < 100
                                            ? 'warning'
                                            : 'danger'
                                    }
                                    onClick={() =>
                                        setViewModal({
                                            show: true,
                                            transactions: categoryTransactions,
                                            title: budget.categoryName,
                                        })
                                    }
                                />
                                <BudgetText>
                                    ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
                                </BudgetText>
                                <ButtonWrapper onClick={() => props.openEditModal(budget)}>
                                    <ButtonIcon>
                                        <svg viewBox='0 0 512 512'>
                                            <polygon points='51.2,353.28 0,512 158.72,460.8' />
                                            <rect
                                                x='89.73'
                                                y='169.097'
                                                transform='matrix(0.7071 -0.7071 0.7071 0.7071 -95.8575 260.3719)'
                                                width='353.277'
                                                height='153.599'
                                            />
                                            <path d='M504.32,79.36L432.64,7.68c-10.24-10.24-25.6-10.24-35.84,0l-23.04,23.04l107.52,107.52l23.04-23.04 C514.56,104.96,514.56,89.6,504.32,79.36z' />
                                        </svg>
                                    </ButtonIcon>
                                </ButtonWrapper>
                            </BudgetSubWrapper>
                        </BudgetWrapper>
                    );
                })
            ) : (
                <div>No Budgets Available</div>
            )}
            <ViewModal
                show={viewModal.show}
                close={() => setViewModal({ show: false, transactions: [], title: '' })}
                title={viewModal.title}
                transactions={viewModal.transactions}
            />
        </>
    );
};

const BudgetWrapper = styled.div`
    margin-top: 10px;
    max-width: 800px;
    width: calc(100% - 40px);
`;

const BudgetSubWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const BudgetCategory = styled.div`
    font-size: 16px;
`;

const ProgressBarWrapper = styled(ProgressBar)`
    background-image: linear-gradient(45deg, #d0d0d0, #dcdcdc);
    cursor: pointer;
    width: 80%;
    &:hover {
        box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
    }
`;

const BudgetText = styled.div`
    font-size: 14px;
    margin: 0 10px;
    white-space: nowrap;
`;

const ButtonWrapper = styled(Button)`
    justify-content: center;
    &&& {
        align-items: center;
        display: flex;
        font-weight: 700;
        line-height: inherit;
        padding: 4px;
        white-space: nowrap;
    }
    margin-left: auto;
`;

const ButtonIcon = styled.svg`
    fill: #fff;
    height: 16px;
    width: 16px;
`;

export default BudgetList;
