import { parse } from 'dotenv/types';
/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import { ProgressBar } from 'react-bootstrap';

// TYPES //
import { Budget, Transaction, Category } from '../../types';

// UTILS //
import { parseTotalBudget } from '../shared/BudgetUtils';

interface Props {
    budgets: Budget[];
    transactions: Transaction[];
    categories: Category[];
    monthDate: Date | number;
}

const BudgetList: React.FC<Props> = props => {
    return (
        <>
            {props.budgets.length ? (
                props.budgets.map(budget => {
                    const transactionType = props.categories.find(
                        category => category.name === budget.categoryName
                    ).type;
                    let totalSpent = 0;
                    props.transactions.forEach(transaction => {
                        const transactionDate = new Date(transaction.date);
                        const budgetDate = new Date(props.monthDate);
                        if (
                            transaction.category === budget.categoryName &&
                            transactionDate.getFullYear() === budgetDate.getFullYear() &&
                            transactionDate.getMonth() === budgetDate.getMonth()
                        ) {
                            totalSpent += transaction.amount;
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
                    const budgetProgress = (totalSpent / totalBudget) * 100;
                    return (
                        <div key={budget._id}>
                            <div>{budget.categoryName}</div>
                            <ProgressBar
                                animated
                                now={budgetProgress}
                                variant={
                                    budgetProgress < 50
                                        ? 'success'
                                        : budgetProgress < 100
                                        ? 'warning'
                                        : 'danger'
                                }
                            />
                            <div>
                                ${totalSpent.toFixed(2)} of ${totalBudget.toFixed(2)}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div>No Budgets Available</div>
            )}
        </>
    );
};

export default BudgetList;
