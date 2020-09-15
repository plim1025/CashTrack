// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import Select, { components } from 'react-select';

// CONTEXT //
import { CategoryContext } from '../../view/Transactions';

// TYPES //
import { Category } from '../../types';

interface Props {
    padded?: boolean;
    defaultCategory?: string;
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
        <SelectWrapper
            autoFocus
            padded={props.padded}
            className='react-select'
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
            formatGroupLabel={(data: any) => <div>{data.label}</div>}
            styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            components={{
                Menu: (menuProps: any) => (
                    <MenuWrapper {...menuProps}>
                        {menuProps.children}
                        <ButtonWrapper
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
                        </ButtonWrapper>
                    </MenuWrapper>
                ),
            }}
            onChange={props.onChange}
            onBlur={props.onBlur}
        />
    );
};

// STYLES //
const SelectWrapper = styled(Select)<{ padded: boolean }>`
    .react-select__control {
        height: calc(1.5em + 0.75rem + 2px) !important;
        border: 1px solid #ced4da !important;
        border-radius: 0.25rem !important;
    }

    .react-select__control--menu-is-open,
    .react-select__control--is-focused {
        border-color: #80bdff !important;
        outline: 0 !important;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
    }

    .react-select__value-container {
        max-height: 42px;
        padding: ${({ padded }) => padded && '2px 0.75rem'};
    }
`;

const MenuWrapper = styled(components.Menu)`
    font-family: 'Open Sans';
    font-size: 14px;

    .react-select__menu-list {
        overflow-x: hidden;
    }

    .react-select__option {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .react-select__option--is-focused {
        background: rgba(0, 123, 255, 0.25);
    }
`;

const ButtonWrapper = styled(Button)`
    font-size: 14px !important;
`;

export default CategoryDropdown;
