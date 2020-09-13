/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useEffect, useContext } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Button, Modal } from 'react-bootstrap';
import Error from '../shared/Error';

// CONTEXT //
import { ResourcesContext } from '../../App';
import { CategoryModalContext } from '../../view/Transactions';

// TYPES //
import { Category } from '../../types';

interface Props {
    toggled: boolean;
    close: () => void;
}

const parseCategories = (
    categories: Category[],
    type: string,
    onClickHandler: (name?: string, type?: string) => void
) => {
    return categories
        .filter((category: Category) => category.type === type)
        .sort((a: Category, b: Category) => (a.name.toUpperCase() > b.name.toUpperCase() ? 0 : -1))
        .map((category: Category) => {
            // eslint-disable-next-line prettier/prettier
            const defaultCategories = ['Bank Fees', 'Legal Fees', 'Charitable Giving', 'Medical', 'Cash', 'Check', 'Education', 'Membership Fee', 'Service', 'Utilities', 'Postage/Shipping', 'Restaurant', 'Entertainment', 'Loan', 'Rent', 'Home Maintenance/Improvement', 'Automotive', 'Electronic', 'Insurance', 'Business Expenditure', 'Real Estate', 'Personal Care', 'Gas', 'Subscription', 'Travel', 'Shopping', 'Clothing', 'Groceries', 'Tax', 'Subsidy', 'Interest', 'Deposit', 'Payroll/Salary', 'Cash', 'Transfer'];
            if (defaultCategories.indexOf(category.name) === -1) {
                return (
                    <div
                        key={category.name}
                        onClick={() => onClickHandler(category.name, category.type)}
                        className={css(ss.columnCell)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={css(ss.columnText)}>{category.name}</div>
                        <svg className={css(ss.editIcon)} viewBox='0 0 512 512'>
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
                    </div>
                );
            }
            return (
                <div key={category.name} className={css(ss.columnCell)}>
                    <div className={css(ss.columnText)}>{category.name}</div>
                </div>
            );
        });
};

const CategoryModal: React.FC<Props> = props => {
    const { categories: resourceCategories } = useContext(ResourcesContext);
    const { openCategorySubmodal } = useContext(CategoryModalContext);
    const [categories, setCategories] = useState(() => resourceCategories.read());

    return (
        <Modal
            centered
            onHide={() => props.close()}
            show={props.toggled}
            dialogClassName='category-modal'
        >
            <Modal.Header closeButton>
                <h4 className={css(ss.header)}>Manage Categories</h4>
                <Button className={css(ss.button)} onClick={() => openCategorySubmodal()}>
                    + Category
                </Button>
            </Modal.Header>
            <div className={css(ss.table)}>
                <div className={css(ss.column)}>
                    <div className={css(ss.columnHeader)}>Expense</div>
                    {parseCategories(categories, 'expense', () => (name: string, type: string) =>
                        openCategorySubmodal(name, type)
                    )}
                </div>
                <div className={css(ss.column)}>
                    <div className={css(ss.columnHeader)}>Income</div>
                    {parseCategories(categories, 'income', (name: string, type: string) =>
                        openCategorySubmodal(name, type)
                    )}
                </div>
                <div className={css(ss.column)}>
                    <div className={css(ss.columnHeader)}>Other</div>
                    {parseCategories(categories, 'other', (name: string, type: string) =>
                        openCategorySubmodal(name, type)
                    )}
                </div>
            </div>
        </Modal>
    );
};

// STYLES //
const ss = StyleSheet.create({
    table: {
        display: 'flex',
        overflowY: 'auto',
        padding: '1rem',
        paddingTop: '.5rem',
    },
    header: {
        fontWeight: 700,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        width: '33%',
    },
    columnCell: {
        display: 'flex',
        alignItems: 'center',
        height: 30,
        minHeight: 30,
        padding: '.25rem 0',
        ':hover svg': {
            fill: '#000',
        },
    },
    columnHeader: {
        textDecoration: 'underline',
        fontWeight: 700,
    },
    columnText: {
        width: 'calc(100% - 20px)',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: 14,
        marginRight: 8,
    },
    editIcon: {
        fill: '#fff',
        height: 12,
        width: 12,
    },
    button: {
        marginLeft: 'auto',
        // @ts-ignore
        fontWeight: '700 !important',
    },
});

export default CategoryModal;
