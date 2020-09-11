import { Transaction, Trends, Subtrends, Dates, Data } from '../../types';

export const parseSelectedTransactions = (
    transactions: Transaction[],
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
    if (trend === 'net earnings' || trend === 'net worth') {
        return dateFilteredTransactions;
    }
    return dateFilteredTransactions
        .filter(transaction => transaction.type === trend)
        .filter(transaction => accountIDs.indexOf(transaction.accountID) !== -1);
};

export const parseTransactionData = (
    transactions: Transaction[],
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
                newData.set(`${monthArr[firstTransactionMonth]} ${firstTransactionYear}`, 0);
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
                newData.set(`${monthArr[curMonth]} ${curYear}`, 0);
                if (curMonth === 11) {
                    curMonth = 0;
                    curYear++;
                } else {
                    curMonth++;
                }
            });
        } else if (date === 'month') {
            todayDate.setDate(todayDate.getDate() - 29);
            [...Array(30)].forEach((nothing, index) => {
                const curDay = todayDate.getDate();
                if (index === 0) {
                    newData.set(`${monthArr[todayDate.getMonth()]} ${curDay}`, 0);
                } else {
                    newData.set(curDay, 0);
                }
                todayDate.setDate(todayDate.getDate() + 1);
            });
        } else if (date === 'week') {
            todayDate.setDate(todayDate.getDate() - 6);
            [...Array(7)].forEach((nothing, index) => {
                const curDay = todayDate.getDate();
                if (index === 0) {
                    newData.set(`${monthArr[todayDate.getMonth()]} ${curDay}`, 0);
                } else {
                    newData.set(curDay, 0);
                }
                todayDate.setDate(todayDate.getDate() + 1);
            });
        }
    }
    transactions.forEach((transaction: Transaction) => {
        if (subtrend === 'date') {
            const transactionDate = new Date(transaction.date);
            if (date === 'all time' || date === 'year') {
                const curAmount =
                    parseFloat(
                        newData.get(
                            `${
                                monthArr[transactionDate.getMonth()]
                            } ${transactionDate.getFullYear()}`
                        )
                    ) || 0;
                newData.set(
                    `${monthArr[transactionDate.getMonth()]} ${transactionDate.getFullYear()}`,
                    (Math.round(curAmount + transaction.amount * -1) * 100) / 100
                );
            } else {
                const hasKey = newData.has(transactionDate.getDate());
                let curAmount;
                if (hasKey) {
                    curAmount = parseFloat(newData.get(transactionDate.getDate())) || 0;
                    newData.set(
                        transactionDate.getDate(),
                        Math.round((curAmount + transaction.amount * -1) * 100) / 100
                    );
                } else {
                    curAmount = parseFloat(newData.get(newData.keys().next().value));
                    newData.set(
                        newData.keys().next().value,
                        (Math.round(curAmount + transaction.amount * -1) * 100) / 100
                    );
                }
            }
        } else {
            if (newData.has(transaction[subtrend]) && transaction[subtrend]) {
                const curAmount = newData.get(transaction[subtrend]);
                newData.set(
                    transaction[subtrend],
                    (Math.round(curAmount + transaction.amount * -1) * 100) / 100
                );
            } else if (transaction[subtrend]) {
                newData.set(
                    transaction[subtrend],
                    (Math.round(transaction.amount * -1) * 100) / 100
                );
            }
        }
    });
    const parsedData = Array.from(newData.keys()).map(databin => ({
        id: databin,
        value: newData.get(databin),
    }));
    return parsedData;
};
