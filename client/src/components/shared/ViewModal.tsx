// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Modal, Table } from 'react-bootstrap';

// TYPES //
import { Transaction } from '../../types';

// UTIL //
import { formatDate, formatDescription } from '../Transactions/TransactionUtil';
import { moneyFormat } from './SharedUtils';

interface Props {
    show: boolean;
    close: () => void;
    title: string;
    transactions: Transaction[];
}

const ViewModal: React.FC<Props> = props => {
    return (
        <ModalWrapper centered show={props.show} onHide={() => props.close()}>
            <Modal.Header closeButton>
                <h4 className='w-100'>{props.title}</h4>
            </Modal.Header>
            <Modal.Body>
                {props.transactions.length ? (
                    <TableWrapper bordered>
                        <thead>
                            <tr>
                                <th style={{ width: 100 }}>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th style={{ width: 136 }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.transactions.map(transaction => (
                                <tr key={transaction._id}>
                                    <td>{formatDate(transaction.date)}</td>
                                    <td>{formatDescription(transaction.description)}</td>
                                    <td>{transaction.category}</td>
                                    <td>{moneyFormat(transaction.amount.toString())}</td>
                                </tr>
                            ))}
                        </tbody>
                    </TableWrapper>
                ) : (
                    <div>No transactions in this time period</div>
                )}
            </Modal.Body>
        </ModalWrapper>
    );
};

// STYLES //
const ModalWrapper = styled(Modal)`
    .modal-dialog {
        max-width: none;
        width: 600px;
    }
    .modal-content {
        display: flex;
        max-height: 700px;
        padding-bottom: 10px;
    }
    .modal-body {
        overflow-y: auto;
    }
`;

const TableWrapper = styled(Table)`
    font-size: 12px;
    & td,
    th {
        overflow: hidden;
        padding: 0.25rem 0.5rem !important;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export default ViewModal;
