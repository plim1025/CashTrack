// REACT //
import React from 'react';

// COMPONENTS //
import CategoryModal from './CategoryModal';
import CategorySubmodal from './CategorySubmodal';
import CategoryDeleteModal from './CategoryDeleteModal';

// TYPES //
import { Category } from '../../types';

interface Props {
    setLoading: (loading: boolean) => void;
    categoryModal: boolean;
    categorySubmodal: {
        show: boolean;
        mode: string;
        category: Category;
    };
    categoryDeleteModal: boolean;
    openCategorySubmodal: (mode: string, category: Category) => void;
    openCategoryDeleteModal: () => void;
    hideCategoryModal: () => void;
    hideCategorySubmodal: () => void;
    hideCategoryDeleteModal: () => void;
}

const CategoryModals: React.FC<Props> = props => {
    return (
        <>
            <CategoryModal
                show={props.categoryModal}
                close={props.hideCategoryModal}
                openSubmodal={props.openCategorySubmodal}
            />
            <CategorySubmodal
                setLoading={props.setLoading}
                show={props.categorySubmodal.show}
                close={props.hideCategorySubmodal}
                mode={props.categorySubmodal.mode}
                category={props.categorySubmodal.category}
                openDeleteModal={props.openCategoryDeleteModal}
            />
            <CategoryDeleteModal
                setLoading={props.setLoading}
                show={props.categoryDeleteModal}
                close={props.hideCategoryDeleteModal}
                category={props.categorySubmodal.category ? props.categorySubmodal.category : null}
            />
        </>
    );
};

export default CategoryModals;
