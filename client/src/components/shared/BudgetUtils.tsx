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

export const generateDateMonths = (monthDate: Date): DropdownOption[] => {
    const year = monthDate.getFullYear();
    return [
        { label: `Jan ${year}`, value: new Date(year, 0, 0) },
        { label: `Feb ${year}`, value: new Date(year, 1, 0) },
        { label: `Mar ${year}`, value: new Date(year, 2, 0) },
        { label: `Apr ${year}`, value: new Date(year, 3, 0) },
        { label: `May ${year}`, value: new Date(year, 4, 0) },
        { label: `Jun ${year}`, value: new Date(year, 5, 0) },
        { label: `Jul ${year}`, value: new Date(year, 6, 0) },
        { label: `Aug ${year}`, value: new Date(year, 7, 0) },
        { label: `Sep ${year}`, value: new Date(year, 8, 0) },
        { label: `Oct ${year}`, value: new Date(year, 9, 0) },
        { label: `Nov ${year}`, value: new Date(year, 10, 0) },
        { label: `Dec ${year}`, value: new Date(year, 11, 0) },
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
        value: new Date(editMonth),
    };
};
