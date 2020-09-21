import { Budget, Transaction } from '../../types';

export const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
        case 'day':
            return 'Daily';
        case 'week':
            return 'Weekly';
        case 'month':
            return 'Monthly';
        case 'year':
            return 'Yearly';
        default:
            console.log('Error getting frequency label');
            return '';
    }
};

export const createBudget = async (budget: Budget): Promise<string> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                frequency: budget.frequency,
                amount: budget.amount,
                categoryName: budget.categoryName,
                startDate: budget.startDate,
                endDate: budget.endDate,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const { id } = await response.json();
        return id;
    } catch (error) {
        throw Error(`Error creating budget: ${error}`);
    }
};

export const parseTotalBudget = (budget: Budget, totalSpent: number, monthDate: Date): number => {
    let totalBudget;
    if (budget.frequency === 'day') {
        const daysInMonth = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            0
        ).getDate();
        totalBudget = budget.amount * daysInMonth;
    } else if (budget.frequency === 'week') {
        const daysInMonth = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            0
        ).getDate();
        totalBudget = (budget.amount * daysInMonth) / 7;
    } else if (budget.frequency === 'month') {
        totalBudget = budget.amount;
    } else if (budget.frequency === 'year') {
        totalBudget = budget.amount / 12;
    } else if (budget.frequency === 'one-time') {
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);
        let startDateMonth = startDate.getMonth();
        let startDateYear = startDate.getFullYear();
        const endDateMonth = endDate.getMonth();
        const endDateYear = endDate.getFullYear();
        let monthsToSave = 0;
        while (startDateMonth !== endDateMonth || startDateYear !== endDateYear) {
            monthsToSave++;
            if (startDateMonth === 11) {
                startDateYear = 0;
                startDateMonth++;
            } else {
                startDateMonth++;
            }
        }
        totalBudget = budget.amount / monthsToSave;
    }
    return totalBudget;
};
