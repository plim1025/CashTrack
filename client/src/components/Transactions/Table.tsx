// REACT //
import React, { useRef } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import CategoryDropdown from './CategoryDropdown';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

// TYPES //
import { Transaction } from '../../types';

// STYLES //
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// UTILS //
import { updateTransaction } from '../shared/TransactionUtil';

interface Props {
    transactions: Transaction[];
    selectedTransactionIDs: string[];
    setSelectedTransactionIDs: (selectedTransactionIDs: string[]) => void;
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
        <BootstrapTableWrapper>
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
                                    updateTransaction(item._id, transaction);
                                },
                            })}
                        />
                    </>
                )}
            </ToolkitProvider>
        </BootstrapTableWrapper>
    );
};

const BootstrapTableWrapper = styled.div`
    #transaction-table {
        font-size: 14px;
    }

    .transaction-table-header th,
    .transaction-table-body td {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .transaction-table-header th {
        padding: 0.5rem !important;
    }

    .transaction-table-header th:nth-child(2) {
        width: 136px;
    }

    .transaction-table-header th:nth-child(5) {
        width: 136px;
    }

    .transaction-table-body td {
        padding: 0.25rem 0.5rem !important;
    }

    .transaction-table-body td:hover {
        cursor: pointer;
        background: rgba(0, 123, 255, 0.25);
    }

    .transaction-table-edit-cell .editor {
        padding: 0.25rem;
        height: 38px;
    }

    .transaction-table-edit-cell .alert {
        margin-bottom: 0 !important;
        white-space: normal;
        padding: 0.25rem;
    }

    .transaction-table-edit-cell input {
        font-size: 14px !important;
        color: #212529 !important;
    }

    .transaction-table-edit-cell-date input {
        padding: 0 !important;
        font-size: 12px !important;
    }

    .selection-cell {
        text-align: center;
        background: inherit !important;
        cursor: auto !important;
    }

    .selection-cell-header {
        text-align: center;
    }

    .search-label {
        width: 100%;
        margin-bottom: 20px;
    }

    .search-label input {
        height: 40px;
    }
`;

export default Table;
