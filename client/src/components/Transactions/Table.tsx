// REACT //
import React, { useContext, useState, useEffect } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// @ts-ignore
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Dropdown from '../shared/Dropdown';
import CategoryDropdownMenu from '../shared/CategoryDropdownMenu';
import { Form } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Transaction } from '../../types';

// STYLES //
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// UTILS //
import {
    formatDate,
    sortDate,
    validateDate,
    formatDescription,
    validateDescription,
    validateAmount,
    updateTransactions,
} from './TransactionUtil';
import { moneyFormat, parseCategoryDropdownOptions } from '../shared/SharedUtils';

interface Props {
    selectedTransactionIDs: string[];
    setSelectedTransactionIDs: (selectedTransactionIDs: string[]) => void;
    openCategoryModal: () => void;
}

const Table: React.FC<Props> = props => {
    const { transactions, categories, setTransactions } = useContext(ResourcesContext);
    const [filteredTransactions, setFilteredTransactions] = useState(
        transactions.filter(transaction => transaction.selected)
    );
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredTransactions(transactions.filter(transaction => transaction.selected));
    }, [transactions]);

    useEffect(() => {
        if (!search) {
            setFilteredTransactions(transactions.filter(transaction => transaction.selected));
        } else {
            const parsedSearch = search.toLowerCase();
            const searchedTransactions = transactions.filter(
                transaction =>
                    transaction.selected &&
                    (moneyFormat(transaction.amount).toLowerCase().includes(parsedSearch) ||
                        transaction.category.toLowerCase().includes(parsedSearch) ||
                        formatDate(transaction.date).includes(parsedSearch) ||
                        formatDescription(transaction.description)
                            .toLowerCase()
                            .includes(parsedSearch))
            );
            setFilteredTransactions(searchedTransactions);
        }
    }, [search]);

    const tableColumns = [
        {
            text: 'Date',
            dataField: 'date',
            editCellClasses: 'transaction-table-edit-cell transaction-table-edit-cell-date',
            editor: {
                type: Type.DATE,
            },
            formatter: formatDate,
            sort: true,
            sortFunc: sortDate,
            validator: validateDate,
        },
        {
            text: 'Description',
            dataField: 'description',
            editCellClasses: 'transaction-table-edit-cell',
            formatter: formatDescription,
            sort: true,
            validator: validateDescription,
        },
        {
            text: 'Category',
            dataField: 'category',
            editCellClasses: 'transaction-table-edit-cell',
            sort: true,
            blurToSave: false,
            editorRenderer: (editorProps: any, value: string) => (
                <Dropdown
                    size='sm'
                    options={parseCategoryDropdownOptions(categories)}
                    defaultOption={{ label: value, value: value }}
                    onChange={category => editorProps.onUpdate(category.value)}
                    onUpdate={editorProps.onUpdate}
                    menuComponent={(menuProps: any) => (
                        <CategoryDropdownMenu
                            menuProps={menuProps}
                            openCategoryModal={props.openCategoryModal}
                        />
                    )}
                />
            ),
        },
        {
            text: 'Amount',
            dataField: 'amount',
            editCellClasses: 'transaction-table-edit-cell',
            formatter: moneyFormat,
            sort: true,
            validator: validateAmount,
        },
    ];

    return (
        <BootstrapTableWrapper>
            <FormWrapper inline>
                <Form.Control
                    onChange={e => setSearch(e.target.value)}
                    type='text'
                    placeholder='Search'
                />
            </FormWrapper>
            <BootstrapTable
                bootstrap4
                keyField='_id'
                data={filteredTransactions}
                columns={tableColumns}
                id='transaction-table'
                headerClasses='transaction-table-header'
                bodyClasses='transaction-table-body'
                defaultSortDirection='asc'
                defaultSorted={[{ dataField: 'date', order: 'desc' }]}
                selectRow={{
                    mode: 'checkbox',
                    selected: props.selectedTransactionIDs,
                    onSelect: (row: any, isSelect) => {
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
                    onSelectAll: (isSelect, rows: any) => {
                        if (isSelect) {
                            props.setSelectedTransactionIDs(
                                rows.map((transaction: Transaction) => transaction._id)
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
                            value: filteredTransactions ? filteredTransactions.length : 0,
                        },
                    ],
                })}
                cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: true,
                    afterSaveCell: async (
                        oldValue: any,
                        newValue: any,
                        item: Transaction,
                        itemType: {
                            dataField: 'date' | 'description' | 'category' | 'amount';
                        }
                    ) => {
                        let valueChanged = false;
                        if (itemType.dataField === 'date') {
                            const oldDate = new Date(oldValue);
                            const newDate = new Date(newValue);
                            oldDate.setHours(0, 0, 0, 0);
                            newDate.setHours(0, 0, 0, 0);
                            newDate.setDate(newDate.getDate() + 1);
                            if (oldDate.getTime() !== newDate.getTime()) {
                                valueChanged = true;
                            }
                        } else {
                            if (oldValue.toString() !== newValue.toString()) {
                                valueChanged = true;
                            }
                        }
                        if (valueChanged) {
                            const newTransaction = {
                                ...item,
                                [itemType.dataField]:
                                    itemType.dataField === 'amount'
                                        ? parseFloat(newValue)
                                        : newValue,
                            };
                            setTransactions([
                                ...transactions.filter(transaction => transaction._id !== item._id),
                                newTransaction,
                            ]);
                            await updateTransactions([item._id], newTransaction);
                        }
                    },
                })}
            />
        </BootstrapTableWrapper>
    );
};

const FormWrapper = styled(Form)`
    &&& input {
        width: 100%;
    }
    margin-bottom: 10px;
`;

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
