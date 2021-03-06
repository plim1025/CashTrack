/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import Button from './Button';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Category } from '../../types';

interface Props {
    show: boolean;
    close: () => void;
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
            const defaultCategories = ['Bank Fees', 'Legal Fees', 'Charitable Giving', 'Medical', 'Cash', 'Check', 'Education', 'Membership Fee', 'Service', 'Utilities', 'Postage/Shipping', 'Restaurant', 'Entertainment', 'Loan', 'Rent', 'Home Maintenance/Improvement', 'Automotive', 'Electronic', 'Insurance', 'Business Expenditure', 'Real Estate', 'Personal Care', 'Gas', 'Subscription', 'Travel', 'Shopping', 'Clothing', 'Groceries', 'Tax', 'Subsidy', 'Interest', 'Deposit', 'Payroll/Salary', 'Cash', 'Transfer', 'Investment', 'Savings', 'Retirement', 'Uncategorized'];
            if (defaultCategories.indexOf(category.name) === -1) {
                return (
                    <Cell
                        key={category.name}
                        onClick={() => onClickHandler(category)}
                        style={{ cursor: 'pointer' }}
                    >
                        <CellText>{category.name}</CellText>
                        <CellIcon viewBox='0 0 512 512'>
                            <polygon points='51.2,353.28 0,512 158.72,460.8' />
                            <rect
                                x='89.73'
                                y='169.097'
                                transform='matrix(0.7071 -0.7071 0.7071 0.7071 -95.8575 260.3719)'
                                width='353.277'
                                height='153.599'
                            />
                            <path d='M504.32,79.36L432.64,7.68c-10.24-10.24-25.6-10.24-35.84,0l-23.04,23.04l107.52,107.52l23.04-23.04 C514.56,104.96,514.56,89.6,504.32,79.36z' />
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
    const { categories } = useContext(ResourcesContext);

    return (
        <ModalWrapper centered onHide={() => props.close()} show={props.show}>
            <ModalHeaderWrapper closeButton>
                <HeaderText>Manage Categories</HeaderText>
                <Button
                    child='+ Category'
                    onClick={() => props.openSubmodal('add')}
                    style={{ marginLeft: 'auto' }}
                />
            </ModalHeaderWrapper>
            <Table>
                <Column>
                    <ColumnHeader>Expense</ColumnHeader>
                    {parseCategories(categories, 'expenses', (category: Category) =>
                        props.openSubmodal('edit', category)
                    )}
                </Column>
                <Column>
                    <ColumnHeader>Income</ColumnHeader>
                    {parseCategories(categories, 'income', (category: Category) =>
                        props.openSubmodal('edit', category)
                    )}
                </Column>
                <Column>
                    <ColumnHeader>Other</ColumnHeader>
                    {parseCategories(categories, 'other', (category: Category) =>
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
    font-size: 1.25rem;
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
    margin: 0 5px;
    width: 33%;
`;

const ColumnHeader = styled.div`
    font-weight: 700;
    text-decoration: underline;
`;

const Cell = styled.div`
    align-items: center;
    display: flex;
    height: 30px;
    min-height: 30px;
    padding: 0.25rem 0;
    &:hover svg {
        fill: #000;
    }
`;

const CellText = styled.div`
    font-size: 16px;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 20px);
`;

const CellIcon = styled.svg`
    fill: #fff;
    height: 12px;
    width: 12px;
`;

export default CategoryModal;
