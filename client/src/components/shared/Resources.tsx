const wrapPromise = (promise: any) => {
    let status = 'loading';
    let result: any;
    const suspender = promise.then(
        (data: any) => {
            status = 'success';
            result = data;
        },
        (error: any) => {
            status = 'error';
            result = error;
        }
    );

    return {
        read() {
            if (status === 'loading') {
                throw suspender;
            } else if (status === 'error') {
                throw result;
            } else if (status === 'success') {
                return result;
            }
        },
    };
};

const fetchTransactions = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
            credentials: 'include',
        });
        const parsedResponse = await response.json();
        if (parsedResponse.length) {
            const typedResponse = parsedResponse.map((transaction: any) => {
                const date = new Date(transaction.date);
                date.setDate(date.getDate() + 1);
                const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                return {
                    ...transaction,
                    date: dateString,
                    amount: transaction.amount.toFixed(2),
                    selected: true,
                };
            });
            return typedResponse;
        }
        return [];
    } catch (error) {
        console.log(`Error setting plaid transactions: ${error}`);
        return [];
    }
};

const fetchAccounts = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/plaidAccount`, {
            credentials: 'include',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const parsedResponse = await response.json();
        if (parsedResponse.length) {
            const typedResponse = parsedResponse.map(({ batchID, ...account }: any) => account);
            return typedResponse;
        }
        return [];
    } catch (error) {
        console.log(`Error setting plaid accounts: ${error}`);
        return [];
    }
};

const createResource = (): { transactions: any; accounts: any } => {
    return {
        transactions: wrapPromise(fetchTransactions()),
        accounts: wrapPromise(fetchAccounts()),
    };
};

export default createResource;
