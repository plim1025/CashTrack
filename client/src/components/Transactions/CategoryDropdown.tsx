// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import { Button } from 'react-bootstrap';
import Select, { components } from 'react-select';

// TYPES //
import { Category } from '../../types';

interface Props {
    editorProps: any;
    defaultCategory: string;
    categories: Category[];
}

const parseCategories = (categories: Category[], type: string) => {
    return categories
        .filter(category => category.type === type)
        .map(category => ({ value: category.name, label: category.name }))
        .sort((a, b) => (a.value.toUpperCase() > b.value.toUpperCase() ? 0 : -1));
};

const CategoryDropdown: React.FC<Props> = props => {
    return (
        <>
            <Select
                autoFocus
                classNamePrefix='react-select'
                // ref={dropdownMenuRef}
                options={[
                    {
                        label: 'Expense',
                        options: parseCategories(props.categories, 'expense'),
                    },
                    {
                        label: 'Income',
                        options: parseCategories(props.categories, 'income'),
                    },
                    {
                        label: 'Other',
                        options: parseCategories(props.categories, 'other'),
                    },
                ]}
                defaultValue={{ label: props.defaultCategory, value: props.defaultCategory }}
                formatGroupLabel={data => <div>{data.label}</div>}
                styles={{ menuPortal: base => ({ ...base, zIndex: 99 }) }}
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
                                // onClick={() => setModal(true)}
                            >
                                Manage Categories
                            </Button>
                        </components.Menu>
                    ),
                }}
                onChange={(category: any) => props.editorProps.onUpdate(category.value)}
                onBlur={props.editorProps.onBlur}
            />
        </>
    );
};

export default CategoryDropdown;
