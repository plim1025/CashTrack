// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { components } from 'react-select';
import Button from './Button';

interface Props {
    menuProps: any;
    openCategoryModal: () => void;
    openCallback?: () => void;
}

const CategoryDropdownMenu: React.FC<Props> = props => {
    return (
        <MenuWrapper {...props.menuProps}>
            {props.menuProps.children}
            <Button
                child='Manage Categories'
                variant='secondary'
                size='sm'
                block
                onClick={() => {
                    props.openCategoryModal();
                    if (props.openCallback) {
                        props.openCallback();
                    }
                }}
                style={{ fontSize: 16 }}
            />
        </MenuWrapper>
    );
};

// STYLES //
const MenuWrapper = styled(components.Menu)`
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

export default CategoryDropdownMenu;
