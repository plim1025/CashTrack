// REACT //
import React from 'react';

// COMPONENTS //
import TransactionModal from './TransactionModal';
import CategoryModal from './CategoryModal';
import CategorySubmodal from './CategorySubmodal';
import CategoryDeleteModal from './CategoryDeleteModal';

// TYPES //
import { Transaction, Category } from '../../types';

interface Props {
    setLoading: (loading: boolean) => void;
    transactions: Transaction[];
    categories: Category[];
    setTransactions: (transactions: Transaction[]) => void;
    setCategories: (categories: Category[]) => void;
    transactionModal: {
        show: boolean;
        mode: string;
    };
    categoryModal: boolean;
    categorySubmodal: {
        show: boolean;
        mode: string;
        category: Category;
    };
    categoryDeleteModal: boolean;
    openCategoryModal: () => void;
    openCategorySubmodal: (mode: string, category: Category) => void;
    openCategoryDeleteModal: () => void;
    hideTransactionModal: () => void;
    hideCategoryModal: () => void;
    hideCategorySubmodal: () => void;
    hideCategoryDeleteModal: () => void;
    handleCreateTransaction: (transaction: Transaction) => void;
    handleEditMultipleTransactions: (transaction: Transaction) => void;
}

const Modals: React.FC<Props> = props => {
    return (
        <>
            <TransactionModal
                toggled={props.transactionModal.show}
                mode={props.transactionModal.mode}
                close={props.hideTransactionModal}
                openCategory={props.openCategoryModal}
                handleCreateTransaction={props.handleCreateTransaction}
                handleEditMultipleTransactions={props.handleEditMultipleTransactions}
                categories={props.categories}
            />
            <CategoryModal
                toggled={props.categoryModal}
                close={props.hideCategoryModal}
                categories={props.categories}
                openSubmodal={props.openCategorySubmodal}
            />
            <CategorySubmodal
                setLoading={props.setLoading}
                toggled={props.categorySubmodal.show}
                close={props.hideCategorySubmodal}
                mode={props.categorySubmodal.mode}
                category={props.categorySubmodal.category}
                categories={props.categories}
                transactions={props.transactions}
                setCategories={props.setCategories}
                setTransactions={props.setTransactions}
                openDeleteModal={props.openCategoryDeleteModal}
            />
            <CategoryDeleteModal
                setLoading={props.setLoading}
                toggled={props.categoryDeleteModal}
                close={props.hideCategoryDeleteModal}
                categoryName={
                    props.categorySubmodal.category ? props.categorySubmodal.category.name : null
                }
                categories={props.categories}
                transactions={props.transactions}
                setCategories={props.setCategories}
                setTransactions={props.setTransactions}
            />
        </>
    );
};

export default Modals;
