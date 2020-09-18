import { Transaction, Account, Category, Trends, Subtrends, Dates, Data } from '../../types';

export const parseSelectedTransactions = (
    transactions: Transaction[],
    categories: Category[],
    trend: Trends,
    date: Dates,
    accountIDs: string[]
): Transaction[] => {
    const dateFilteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const todayDate = new Date();
        if (date === 'all time') {
            return transaction;
        }
        if (date === 'year') {
            const startDate = new Date(todayDate.getFullYear() - 1, todayDate.getMonth() + 1, 1);
            if (transactionDate >= startDate && transactionDate <= todayDate) {
                return transaction;
            }
        } else if (date === 'month') {
            const startDate = new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                todayDate.getDate() - 29
            );
            if (transactionDate >= startDate && transactionDate <= todayDate) {
                return transaction;
            }
        } else if (date === 'week') {
            const startDate = new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                todayDate.getDate() - 6
            );
            if (transactionDate >= startDate && transactionDate <= todayDate) {
                return transaction;
            }
        }
    });
    if (trend === 'net worth') {
        return dateFilteredTransactions;
    }
    if (trend === 'net earnings') {
        return dateFilteredTransactions
            .map(transaction => {
                const transactionType = categories.find(
                    category => category.name === transaction.category
                ).type;
                return { ...transaction, type: transactionType };
            })
            .filter(transaction => transaction.type !== 'other');
    }
    return dateFilteredTransactions
        .filter(
            transaction =>
                categories.find(category => category.name === transaction.category).type === trend
        )
        .filter(transaction => accountIDs.indexOf(transaction.accountID) !== -1);
};

export const parseTransactionData = (
    transactions: Transaction[],
    accounts: Account[],
    trend: Trends,
    subtrend: Subtrends,
    date: Dates
): Data[] => {
    const newData = new Map();
    // eslint-disable-next-line prettier/prettier
    const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (subtrend === 'date') {
        const todayDate = new Date();
        const firstTransactionDate = new Date(
            transactions
                .map(transaction => transaction.date.toString())
                .sort((a: string, b: string) => Date.parse(a) - Date.parse(b))[0]
        );
        const todayMonth = todayDate.getMonth();
        const todayYear = todayDate.getFullYear();
        let firstTransactionMonth = firstTransactionDate.getMonth();
        let firstTransactionYear = firstTransactionDate.getFullYear();
        if (date === 'all time') {
            while (todayMonth !== firstTransactionMonth || todayYear !== firstTransactionYear) {
                newData.set(`${monthArr[firstTransactionMonth]} ${firstTransactionYear}`, {
                    transactions: [],
                    amount: 0,
                });
                if (firstTransactionMonth === 11) {
                    firstTransactionMonth = 0;
                    firstTransactionYear++;
                } else {
                    firstTransactionMonth++;
                }
            }
            newData.set(`${monthArr[firstTransactionMonth]} ${firstTransactionYear}`, 0);
        } else if (date === 'year') {
            todayDate.setFullYear(todayYear - 1);
            todayDate.setMonth(todayMonth + 1);
            let curMonth = todayDate.getMonth();
            let curYear = todayDate.getFullYear();
            [...Array(12)].forEach(() => {
                newData.set(`${monthArr[curMonth]} ${curYear}`, { transactions: [], amount: 0 });
                if (curMonth === 11) {
                    curMonth = 0;
                    curYear++;
                } else {
                    curMonth++;
                }
            });
        } else if (date === 'month') {
            todayDate.setDate(todayDate.getDate() - 29);
            [...Array(30)].forEach(() => {
                const curDay = todayDate.getDate();
                newData.set(`${monthArr[todayDate.getMonth()]} ${curDay}`, {
                    transactions: [],
                    amount: 0,
                });
                todayDate.setDate(todayDate.getDate() + 1);
            });
        } else if (date === 'week') {
            todayDate.setDate(todayDate.getDate() - 6);
            [...Array(7)].forEach(() => {
                const curDay = todayDate.getDate();
                newData.set(`${monthArr[todayDate.getMonth()]} ${curDay}`, {
                    transactions: [],
                    amount: 0,
                });
                todayDate.setDate(todayDate.getDate() + 1);
            });
        }
    }
    if (trend === 'net earnings') {
        Array.from(newData.keys()).map(key => {
            newData.set(key, { transactions: [], expenses: 0, income: 0 });
        });
    }
    transactions.forEach((transaction: Transaction) => {
        const transactionDate = new Date(transaction.date);
        let curKey;
        if (subtrend === 'date') {
            if (date === 'all time' || date === 'year') {
                curKey = `${monthArr[transactionDate.getMonth()]} ${transactionDate.getFullYear()}`;
            } else {
                curKey = `${monthArr[transactionDate.getMonth()]} ${transactionDate.getDate()}`;
            }
        } else {
            curKey = transaction[subtrend];
        }
        if (curKey) {
            if (trend === 'net earnings') {
                const curData = newData.get(curKey);
                const curExpenses = parseFloat(curData?.expenses) || 0;
                const curIncome = parseFloat(curData?.income) || 0;
                const curTransactions = curData?.transactions || [];
                curTransactions.push(transaction);
                if (transaction.type === 'expenses') {
                    const newExpenses = (Math.round(curExpenses + transaction.amount) * 100) / 100;
                    newData.set(curKey, {
                        transactions: curTransactions,
                        expenses: newExpenses,
                        income: curIncome,
                    });
                } else if (transaction.type === 'income') {
                    const newIncome = (Math.round(curIncome + transaction.amount * -1) * 100) / 100;
                    newData.set(curKey, {
                        transactions: curTransactions,
                        expenses: curExpenses,
                        income: newIncome,
                    });
                }
            } else {
                const curData = newData.get(curKey);
                const curAmount = parseFloat(curData?.amount) || 0;
                const curTransactions = curData?.transactions || [];
                const newAmount = (Math.round(curAmount + transaction.amount * -1) * 100) / 100;
                curTransactions.push(transaction);
                newData.set(curKey, { transactions: curTransactions, amount: newAmount });
            }
        }
    });
    if (trend === 'net earnings') {
        const parsedData = Array.from(newData.keys()).map(databin => ({
            id: databin,
            expenses: newData.get(databin).expenses,
            income: newData.get(databin).income,
            transactions: newData.get(databin).transactions,
        }));
        console.log(parsedData);
        return parsedData;
    }
    const parsedData = Array.from(newData.keys()).map(databin => ({
        id: databin,
        value: newData.get(databin).amount,
        transactions: newData.get(databin).transactions,
    }));
    if ((subtrend === 'category' || subtrend === 'merchant') && parsedData.length > 10) {
        const sortedData = parsedData.sort((a, b) => b.value - a.value);
        const tenBinsData = sortedData.slice(0, 10);
        const extraData = sortedData.slice(10, sortedData.length);
        tenBinsData[tenBinsData.length - 1].id = 'Other';
        extraData.forEach(bin => {
            tenBinsData[tenBinsData.length - 1].value += bin.value;
        });
        return tenBinsData;
    }
    return parsedData;
};
