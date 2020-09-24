import { Category, GroupedDropdownOption } from '../../types';

export const DateString = (date?: Date): string => {
    let dateObj = new Date();
    if (date) {
        dateObj = new Date(date);
    }
    return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1 < 10 ? 0 : ''}${
        dateObj.getMonth() + 1
    }-${dateObj.getDate() < 10 ? 0 : ''}${dateObj.getDate()}`;
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

export const createCategory = async (name: string, type: string): Promise<Category> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                type: type,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error adding transaction: ${error}`);
    }
};

export const updateCategory = async (
    id: string,
    name: string,
    type: string,
    transactionIDs: string[]
): Promise<Category> => {
    try {
        const [categoryResponse, transactionResponse] = await Promise.all([
            fetch(`${process.env.BACKEND_URI}/api/category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: name,
                    type: type,
                }),
            }),
            fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transaction: { category: name },
                    transactionIDs: transactionIDs,
                }),
            }),
        ]);
        if (!categoryResponse.ok || !transactionResponse.ok) {
            throw Error('Bad response from server');
        }
        const parsedCategoryResponse = await categoryResponse.json();
        return parsedCategoryResponse;
    } catch (error) {
        throw Error(`Error editing transaction: ${error}`);
    }
};

export const deleteCategory = async (id: string, transactionIDs: string[]): Promise<void> => {
    try {
        const [deleteResponse, editResponse] = await Promise.all([
            fetch(`${process.env.BACKEND_URI}/api/category/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            }),
            fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionIDs: transactionIDs,
                }),
            }),
        ]);
        if (!deleteResponse.ok || !editResponse.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        throw Error(`Error deleting transaction: ${error}`);
    }
};
