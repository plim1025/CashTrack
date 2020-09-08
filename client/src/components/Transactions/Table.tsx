// REACT //
import React from 'react';

// COMPONENTS //
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

// STYLES //
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// TYPES //
import { Transaction } from '../../types';

interface Props {
    transactions: Transaction[];
    selectedTransactionIDs: string[];
    setSelectedTransactionIDs: (selectedTransactionIDs: string[]) => void;
}

const Table: React.FC<Props> = props => {
    const tableColumns = [
        {
            text: 'Date',
            dataField: 'date',
            editor: {
                type: Type.DATE,
            },
            editCellClasses: 'table-date',
            formatter: (cell: Date) => {
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
            formatter: (cell: string) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
        },
        {
            text: 'Category',
            dataField: 'category',
            formatter: (cell: string) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
        },
        {
            text: 'Amount',
            dataField: 'amount',
            formatter: (cell: string) => {
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

    return (
        <BootstrapTable
            bootstrap4
            keyField='_id'
            data={props.transactions}
            bodyClasses='table-cell'
            columns={tableColumns}
            selectRow={{
                mode: 'checkbox',
                selected: props.selectedTransactionIDs,
                onSelect: (row, isSelect) => {
                    if (isSelect) {
                        props.setSelectedTransactionIDs([...props.selectedTransactionIDs, row._id]);
                    } else {
                        props.setSelectedTransactionIDs(
                            props.selectedTransactionIDs.filter(
                                transaction => transaction !== row._id
                            )
                        );
                    }
                },
                onSelectAll: (isSelect, rows) => {
                    if (isSelect) {
                        props.setSelectedTransactionIDs(rows.map(transaction => transaction._id));
                    } else {
                        props.setSelectedTransactionIDs([]);
                    }
                },
            }}
            defaultSortDirection='asc'
            defaultSorted={[{ dataField: 'date', order: 'desc' }]}
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
                        value: props.transactions ? props.transactions.length : 0,
                    },
                ],
            })}
            cellEdit={cellEditFactory({
                mode: 'click',
                afterSaveCell: async (oldValue: any, newValue: any, item: Transaction) => {
                    const transaction = {
                        description: item.description,
                        amount: item.amount,
                        category: item.category,
                        date: item.date,
                    };
                    try {
                        const transactionInfo = JSON.stringify({
                            description: transaction.description,
                            amount: transaction.amount,
                            category: transaction.category,
                            date: transaction.date,
                        });
                        const response = await fetch(
                            `${process.env.BACKEND_URI}/api/transaction/${item._id}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: transactionInfo,
                            }
                        );
                        if (!response.ok) {
                            throw Error(`Bad response from server`);
                        }
                    } catch (error) {
                        throw Error(`Error updating transaction: ${error}`);
                    }
                },
            })}
        />
    );
};

export default Table;
