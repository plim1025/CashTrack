// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { Button } from 'react-bootstrap';
import Select, { components } from 'react-select';

// CONTEXT //
import { CategoryContext } from '../../view/Transactions';

// TYPES //
import { Category } from '../../types';

interface Props {
    defaultCategory?: string;
    class: string;
    onChange: (category: any) => void;
    onBlur?: () => void;
    openCallback?: () => void;
    dropdownRef?: any;
}

const parseCategories = (categories: Category[], type: string) => {
    return categories
        .filter(category => category.type === type)
        .map(category => ({ value: category.name, label: category.name }))
        .sort((a, b) => (a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1));
};

const CategoryDropdown: React.FC<Props> = props => {
    const { categories, openCategoryModal } = useContext(CategoryContext);

    return (
        <Select
            autoFocus
            className={`${props.class} react-select`}
            classNamePrefix='react-select'
            ref={props.dropdownRef}
            options={[
                {
                    label: 'Expense',
                    options: parseCategories(categories, 'expense'),
                },
                {
                    label: 'Income',
                    options: parseCategories(categories, 'income'),
                },
                {
                    label: 'Other',
                    options: parseCategories(categories, 'other'),
                },
            ]}
            defaultValue={
                props.defaultCategory
                    ? { label: props.defaultCategory, value: props.defaultCategory }
                    : null
            }
            formatGroupLabel={data => <div>{data.label}</div>}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            components={{
                Menu: (menuProps: any) => (
                    <components.Menu {...menuProps}>
                        {menuProps.children}
                        <Button
                            className='react-select-dropdown-button'
                            variant='secondary'
                            size='sm'
                            block
                            onClick={() => {
                                openCategoryModal();
                                if (props.openCallback) {
                                    props.openCallback();
                                }
                            }}
                        >
                            Manage Categories
                        </Button>
                    </components.Menu>
                ),
            }}
            onChange={props.onChange}
            onBlur={props.onBlur}
        />
    );
};

export default CategoryDropdown;
