// REACT //
import React, { useState } from 'react';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadTransactions, updateTransaction } from '../redux/Actions';
import { RootState } from '../redux/Store';

// COMPONENTS //
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const Transactions: React.FC = () => {
    const dispatch = useDispatch();
    const stateTransactions = useSelector((state: RootState) => state.transactions);
    const tableColumns = [
        {
            text: 'Date',
            dataField: 'date',
            editor: {
                type: Type.DATE,
            },
            formatter: (cell: any) => {
                const date = new Date(cell);
                return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
            },
            sort: true,
            sortFunc: (a: string, b: string, order: string) => {
                if (order === 'asc') return Date.parse(a) - Date.parse(b);
                return Date.parse(b) - Date.parse(a);
            },
            validator: (newValue: any) => {
                if (!newValue) {
                    return {
                        valid: false,
                        message: 'Invalid Date',
                    };
                }
                return { valid: true };
            },
        },
        {
            text: 'Description',
            dataField: 'description',
            formatter: (cell: any) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
        },
        {
            text: 'Category',
            dataField: 'category',
            formatter: (cell: any) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
        },
        {
            text: 'Amount',
            dataField: 'amount',
            formatter: (cell: any) => {
                const parsedCell = parseFloat(cell);
                if (parsedCell < 0) return `-$${Math.abs(parsedCell).toFixed(2)}`;
                return `$${parsedCell.toFixed(2)}`;
            },
            sort: true,
            validator: (newValue: any) => {
                if (isNaN(newValue) || !newValue) {
                    return {
                        valid: false,
                        message: 'Amount should be numeric',
                    };
                }
                if (parseInt(newValue) > 1000000000) {
                    return {
                        valid: false,
                        message: 'Maximum amount is $1,000,000,000',
                    };
                }
                return { valid: true };
            },
        },
    ];
    const [transactions, setTransactions] = useState(null);

    const getTransactionData = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/transaction`, {
                credentials: 'include',
            });
            const parsedResponse = await response.json();
            const typedResponse = parsedResponse.map((transaction: any) => {
                const date = new Date(transaction.date);
                date.setDate(date.getDate() + 1);
                const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                return {
                    ...transaction,
                    date: dateString,
                    amount: transaction.amount.toFixed(2),
                };
            });
            return typedResponse;
        } catch (error) {
            console.log(`Error setting plaid transactions: ${error}`);
            return [];
        }
    };

    if (!transactions) {
        if (stateTransactions.length) {
            setTransactions(stateTransactions);
        } else {
            const promise = getTransactionData().then(data => {
                setTransactions(data);
                dispatch(loadTransactions(data));
            });
            throw promise;
        }
    }
    return (
        <BootstrapTable
            bootstrap4
            keyField='_id'
            data={transactions || []}
            columns={tableColumns}
            defaultSortDirection='asc'
            pagination={paginationFactory({
                paginationSize: 4,
                sizePerPageList: [
                    {
                        text: '25',
                        value: 25,
                    },
                    {
                        text: '50',
                        value: 50,
                    },
                    {
                        text: '100',
                        value: 100,
                    },
                    {
                        text: 'All',
                        value: transactions ? transactions.length : 0,
                    },
                ],
            })}
            cellEdit={cellEditFactory({
                mode: 'click',
                afterSaveCell: (oldValue: any, newValue: any, item: any) => {
                    const updatedTransaction = {
                        description: item.description,
                        amount: item.amount,
                        category: item.category,
                        date: item.date,
                    };
                    dispatch(updateTransaction(item.transactionID, updatedTransaction));
                },
            })}
        />
    );
};

export default Transactions;
