import { Category, GroupedDropdownOption } from '../../types';

export const DateString = (date?: Date): string => {
    if (date) {
        return new Date(date).toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
};

export const moneyFormat = (money: number | string | Date): string => {
    if (typeof money === 'number') {
        if (money < 0) {
            return `-$${Math.abs(money)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return `$${money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    if (typeof money === 'string') {
        const moneyNum = parseFloat(money);
        if (moneyNum < 0) {
            return `-$${Math.abs(moneyNum)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return `$${moneyNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return 'Error, cannot parse money from date';
};

const parseCategoryGroup = (categories: Category[], type: string) => {
    return categories
        .filter(category => category.type === type)
        .map(category => ({ value: category.name, label: category.name }))
        .sort((a, b) => (a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1));
};

export const parseCategoryDropdownOptions = (categories: Category[]): GroupedDropdownOption[] => {
    return [
        {
            label: 'expenses',
            options: parseCategoryGroup(categories, 'expenses'),
        },
        {
            label: 'income',
            options: parseCategoryGroup(categories, 'income'),
        },
        {
            label: 'other',
            options: parseCategoryGroup(categories, 'other'),
        },
    ];
};
