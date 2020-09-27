/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

// TYPES //
import { Budget, Category } from '../../types';

// UTILS //
import { moneyFormat } from '../shared/SharedUtils';
import { parseTotalBudget } from './BudgetUtils';

interface Props {
    budgets: Budget[];
    categories: Category[];
    monthDate: Date;
}

const fetchBudgetTotal = (
    type: string,
    budgets: Budget[],
    categories: Category[],
    monthDate: Date
) => {
    const filteredBudgets = budgets.filter(
        budget => categories.find(category => category.name === budget.categoryName).type === type
    );
    if (filteredBudgets.length) {
        const totalBudget = filteredBudgets
            .map(budget => parseTotalBudget(budget, monthDate))
            .reduce((a, b) => a + b);
        return totalBudget;
    }
    return 0;
};

const TotalCard: React.FC<Props> = props => {
    const expenseBudgetTotal = fetchBudgetTotal(
        'expenses',
        props.budgets,
        props.categories,
        props.monthDate
    );
    const incomeBudgetTotal = fetchBudgetTotal(
        'income',
        props.budgets,
        props.categories,
        props.monthDate
    );
    const otherBudgetTotal = fetchBudgetTotal(
        'other',
        props.budgets,
        props.categories,
        props.monthDate
    );

    return (
        <>
            {props.budgets.length ? (
                <CardWrapper>
                    <CardTitleWrapper>Total Budgeted</CardTitleWrapper>
                    <CardBodyWrapper>
                        <BudgetTotalItem>
                            <div>Income</div>
                            <BudgetMoney>+{moneyFormat(incomeBudgetTotal)}</BudgetMoney>
                        </BudgetTotalItem>
                        <BudgetTotalItem>
                            <div>Expenses</div>
                            <BudgetMoney>-{moneyFormat(expenseBudgetTotal)}</BudgetMoney>
                        </BudgetTotalItem>
                        <BudgetTotalItem>
                            <div>Other</div>
                            <BudgetMoney>-{moneyFormat(otherBudgetTotal)}</BudgetMoney>
                        </BudgetTotalItem>
                        <SumLine />
                        <BudgetTotalItem>
                            <div>Remaining</div>
                            <BudgetMoney>
                                {moneyFormat(
                                    incomeBudgetTotal - otherBudgetTotal - expenseBudgetTotal
                                )}
                            </BudgetMoney>
                        </BudgetTotalItem>
                    </CardBodyWrapper>
                </CardWrapper>
            ) : null}
        </>
    );
};

// STYLES //
const CardWrapper = styled(Card)`
    margin-bottom: 20px;
    margin-top: 20px;
    padding: 20px;
    width: 250px;
`;

const CardTitleWrapper = styled(Card.Title)`
    margin: 0 auto;
    &&& {
        font-size: 1rem;
        font-weight: 700;
    }
`;

const CardBodyWrapper = styled(Card.Body)`
    &&& {
        font-size: 16px;
        padding: 0;
    }
`;

const BudgetTotalItem = styled.div`
    display: flex;
`;

const BudgetMoney = styled.div`
    margin-left: auto;
`;

const SumLine = styled.div`
    background: #000;
    height: 1px;
    margin-bottom: 10px;
    margin-top: 10px;
`;

export default TotalCard;
