// REACT //
import React from 'react';

// COMPONENTS //
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Select from 'react-select';
import { updateTransaction } from '../shared/TransactionUtil';

// STYLES //
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import '../../assets/css/transactionTable.css';

// TYPES //
import { Transaction, Category } from '../../types';

interface Props {
    categories: Category[];
    transactions: Transaction[];
    selectedTransactionIDs: string[];
    setSelectedTransactionIDs: (selectedTransactionIDs: string[]) => void;
}

const Table: React.FC<Props> = props => {
    const tableColumns = [
        {
            text: 'Date',
            dataField: 'date',
            editCellClasses: 'transaction-table-edit-cell transaction-table-edit-cell-date',
            editor: {
                type: Type.DATE,
            },
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
            editCellClasses: 'transaction-table-edit-cell',
            formatter: (cell: string) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
            validator: (newValue: any) => {
                if (!newValue) {
                    return {
                        valid: false,
                        message: 'Description cannot be empty',
                    };
                }
            },
        },
        {
            text: 'Category',
            dataField: 'category',
            editCellClasses: 'transaction-table-edit-cell',
            formatter: (cell: string) => {
                if (cell.length > 30) return `${cell.substring(0, 30)}...`;
                return cell;
            },
            sort: true,
            validator: (newValue: any) => {
                if (!newValue) {
                    return {
                        valid: false,
                        message: 'Category cannot be empty',
                    };
                }
            },
            editorRenderer: (editorProps: any, value: any, row: any, column: any) => {
                const options = [
                    {
                        label: 'Expense',
                        options: props.categories
                            .filter(category => category.type === 'expense')
                            .map(category => ({ value: category.name, label: category.name }))
                            .sort((a, b) =>
                                a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1
                            ),
                    },
                    {
                        label: 'Income',
                        options: props.categories
                            .filter(category => category.type === 'income')
                            .map(category => ({ value: category.name, label: category.name }))
                            .sort((a, b) =>
                                a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1
                            ),
                    },
                    {
                        label: 'Other',
                        options: props.categories
                            .filter(category => category.type === 'other')
                            .map(category => ({ value: category.name, label: category.name }))
                            .sort((a, b) =>
                                a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1
                            ),
                    },
                ];
                return (
                    <Select
                        options={options}
                        defaultValue={options[0]}
                        classNamePrefix='react-select'
                        formatGroupLabel={data => <div>{data.label}</div>}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 99 }) }}
                        menuPortalTarget={document.body}
                    />
                );
            },
        },
        {
            text: 'Amount',
            dataField: 'amount',
            editCellClasses: 'transaction-table-edit-cell',
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
            id='transaction-table'
            keyField='_id'
            headerClasses='transaction-table-header'
            bodyClasses='transaction-table-body'
            data={props.transactions.map(transaction => ({
                ...transaction,
                amount: transaction.amount.toFixed(2),
            }))}
            columns={tableColumns}
            defaultSortDirection='asc'
            defaultSorted={[{ dataField: 'date', order: 'desc' }]}
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
                // blurToSave: true,
                afterSaveCell: async (oldValue: any, newValue: any, item: Transaction) => {
                    const transaction = {
                        description: item.description,
                        amount: item.amount,
                        category: item.category,
                        date: item.date,
                    };
                    await updateTransaction(item._id, transaction);
                },
            })}
        />
    );
};

export default Table;
