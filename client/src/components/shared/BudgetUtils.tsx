import { Budget, DropdownOption } from '../../types';

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

export const createBudget = async (budget: Budget): Promise<Budget> => {
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
        const newBudget = await response.json();
        return newBudget;
    } catch (error) {
        throw Error(`Error creating budget: ${error}`);
    }
};

export const updateBudget = async (budgetID: string, budget: Budget): Promise<Budget> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/budget/${budgetID}`, {
            method: 'PUT',
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
        const newResponse = await response.json();
        return newResponse;
    } catch (error) {
        throw Error(`Error deleting budget: ${error}`);
    }
};

export const deleteBudget = async (budgetID: string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/budget/${budgetID}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        throw Error(`Error deleting budget: ${error}`);
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

export const generateDateMonths = (monthDate: Date): DropdownOption[] => {
    const year = monthDate.getFullYear();
    return [
        { label: `Jan ${year}`, value: new Date(year, 0, 1) },
        { label: `Feb ${year}`, value: new Date(year, 1, 1) },
        { label: `Mar ${year}`, value: new Date(year, 2, 1) },
        { label: `Apr ${year}`, value: new Date(year, 3, 1) },
        { label: `May ${year}`, value: new Date(year, 4, 1) },
        { label: `Jun ${year}`, value: new Date(year, 5, 1) },
        { label: `Jul ${year}`, value: new Date(year, 6, 1) },
        { label: `Aug ${year}`, value: new Date(year, 7, 1) },
        { label: `Sep ${year}`, value: new Date(year, 8, 1) },
        { label: `Oct ${year}`, value: new Date(year, 9, 1) },
        { label: `Nov ${year}`, value: new Date(year, 10, 1) },
        { label: `Dec ${year}`, value: new Date(year, 11, 1) },
        { label: 'Forever', value: new Date(9999) },
    ];
};

export const getDefaultDateMonth = (
    monthDate: Date,
    mode: string,
    startOrEnd: 'start' | 'end'
): DropdownOption => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let editMonth;
    let editYear;
    if (mode === 'edit') {
        editMonth = monthDate.getMonth();
        editYear = monthDate.getFullYear();
    } else {
        editMonth = new Date().getMonth();
        editYear = new Date().getFullYear();
    }
    if (startOrEnd === 'end') {
        editMonth++;
    }
    if (editMonth === 12) {
        editYear++;
        editMonth = 0;
    }
    return {
        label: `${months[editMonth]} ${editYear}`,
        value: new Date(editYear, editMonth),
    };
};
