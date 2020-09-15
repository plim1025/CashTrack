/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';

// TYPES //
import { Category } from '../../types';

interface Props {
    toggled: boolean;
    close: () => void;
    categories: Category[];
    openSubmodal: (mode: string, category?: Category) => void;
}

const parseCategories = (
    categories: Category[],
    type: string,
    onClickHandler: (category: Category) => void
) => {
    return categories
        .filter((category: Category) => category.type === type)
        .sort((a: Category, b: Category) => (a.name.toUpperCase() > b.name.toUpperCase() ? 0 : -1))
        .map((category: Category) => {
            // eslint-disable-next-line prettier/prettier
            const defaultCategories = ['Uncategorized', 'Bank Fees', 'Legal Fees', 'Charitable Giving', 'Medical', 'Cash', 'Check', 'Education', 'Membership Fee', 'Service', 'Utilities', 'Postage/Shipping', 'Restaurant', 'Entertainment', 'Loan', 'Rent', 'Home Maintenance/Improvement', 'Automotive', 'Electronic', 'Insurance', 'Business Expenditure', 'Real Estate', 'Personal Care', 'Gas', 'Subscription', 'Travel', 'Shopping', 'Clothing', 'Groceries', 'Tax', 'Subsidy', 'Interest', 'Deposit', 'Payroll/Salary', 'Cash', 'Transfer'];
            if (defaultCategories.indexOf(category.name) === -1) {
                return (
                    <Cell key={category.name} onClick={() => onClickHandler(category)}>
                        <CellText>{category.name}</CellText>
                        <CellIcon>
                            <svg viewBox='0 0 512 512'>
                                <polygon points='51.2,353.28 0,512 158.72,460.8' />
                                <rect
                                    x='89.73'
                                    y='169.097'
                                    transform='matrix(0.7071 -0.7071 0.7071 0.7071 -95.8575 260.3719)'
                                    width='353.277'
                                    height='153.599'
                                />
                                <path d='M504.32,79.36L432.64,7.68c-10.24-10.24-25.6-10.24-35.84,0l-23.04,23.04l107.52,107.52l23.04-23.04 C514.56,104.96,514.56,89.6,504.32,79.36z' />
                            </svg>
                        </CellIcon>
                    </Cell>
                );
            }
            return (
                <Cell key={category.name}>
                    <CellText>{category.name}</CellText>
                </Cell>
            );
        });
};

const CategoryModal: React.FC<Props> = props => {
    return (
        <ModalWrapper centered onHide={() => props.close()} show={props.toggled}>
            <ModalHeaderWrapper closeButton>
                <HeaderText>Manage Categories</HeaderText>
                <ButtonWrapper onClick={() => props.openSubmodal('add')}>+ Category</ButtonWrapper>
            </ModalHeaderWrapper>
            <Table>
                <Column>
                    <ColumnHeader>Expense</ColumnHeader>
                    {parseCategories(props.categories, 'expense', (category: Category) =>
                        props.openSubmodal('edit', category)
                    )}
                </Column>
                <Column>
                    <ColumnHeader>Income</ColumnHeader>
                    {parseCategories(props.categories, 'income', (category: Category) =>
                        props.openSubmodal('edit', category)
                    )}
                </Column>
                <Column>
                    <ColumnHeader>Other</ColumnHeader>
                    {parseCategories(props.categories, 'other', (category: Category) =>
                        props.openSubmodal('edit', category)
                    )}
                </Column>
            </Table>
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

    .modal-header .close {
        margin-left: 0 !important;
    }
`;

const ModalHeaderWrapper = styled(Modal.Header)`
    &&& {
        align-items: center;
        display: flex;
    }
`;

const HeaderText = styled.div`
    font-size: 24px;
    font-weight: 700;
`;

const Table = styled.div`
    display: flex;
    overflow-y: auto;
    padding: 1rem;
    padding-top: 0.5rem;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    width: 33%;
`;

const ColumnHeader = styled.div`
    font-weight: 700;
    text-decoration: underline;
`;

const Cell = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 30px;
    min-height: 30px;
    padding: 0.25rem 0;
    & :hover svg {
        fill: '#000';
    }
`;

const CellText = styled.div`
    font-size: 14px;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 20px);
`;

const CellIcon = styled.div`
    fill: #fff;
    height: 12;
    width: 12;
`;

const ButtonWrapper = styled(Button)`
    font-weight: 700;
    margin-left: auto;
`;

export default CategoryModal;
