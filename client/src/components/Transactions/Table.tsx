// REACT //
import React, { useRef } from 'react';

// COMPONENTS //
import CategoryDropdown from './CategoryDropdown';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

// STYLES //
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import '../../assets/css/transactionTable.css';

// TYPES //
import { Transaction } from '../../types';

interface Props {
    transactions: Transaction[];
    selectedTransactionIDs: string[];
    setSelectedTransactionIDs: (selectedTransactionIDs: string[]) => void;
    updateTransaction: (transactionID: string, transaction: Transaction) => void;
}

const Table: React.FC<Props> = props => {
    const dropdownMenuRef = useRef(null);
    window.onresize = () => dropdownMenuRef.current.blur();

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
            sort: true,
            editorRenderer: (editorProps: any, value: any) => (
                <CategoryDropdown
                    class='react-select-table-modal'
                    defaultCategory={value}
                    onChange={category => editorProps.onUpdate(category.value)}
                    onBlur={editorProps.onBlur}
                    dropdownRef={dropdownMenuRef}
                />
            ),
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
        <ToolkitProvider
            bootstrap4
            keyField='_id'
            data={props.transactions}
            columns={tableColumns}
            search
        >
            {toolkitProps => (
                <>
                    <Search.SearchBar {...toolkitProps.searchProps} />
                    <BootstrapTable
                        bootstrap4
                        keyField='_id'
                        data={props.transactions}
                        columns={tableColumns}
                        id='transaction-table'
                        headerClasses='transaction-table-header'
                        bodyClasses='transaction-table-body'
                        defaultSortDirection='asc'
                        defaultSorted={[{ dataField: 'date', order: 'desc' }]}
                        selectRow={{
                            mode: 'checkbox',
                            selected: props.selectedTransactionIDs,
                            onSelect: (row, isSelect) => {
                                if (isSelect) {
                                    props.setSelectedTransactionIDs([
                                        ...props.selectedTransactionIDs,
                                        row._id,
                                    ]);
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
                                    props.setSelectedTransactionIDs(
                                        rows.map(transaction => transaction._id)
                                    );
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
                            afterSaveCell: (
                                oldValue: any,
                                newValue: any,
                                item: Transaction,
                                itemType: {
                                    dataField: 'date' | 'description' | 'category' | 'amount';
                                }
                            ) => {
                                const transaction = {
                                    ...item,
                                    [itemType.dataField]: newValue,
                                };
                                props.updateTransaction(item._id, transaction);
                            },
                        })}
                    />
                </>
            )}
        </ToolkitProvider>
    );
};

export default Table;
