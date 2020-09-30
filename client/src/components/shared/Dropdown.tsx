// REACT //
import React, { useEffect, useRef } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Select, { components, MenuProps, OptionProps } from 'react-select';

// TYPES //
import { DropdownOption, GroupedDropdownOption } from '../../types';

interface Props {
    size: 'bg' | 'sm';
    options: DropdownOption[] | GroupedDropdownOption[];
    defaultOption?: DropdownOption | GroupedDropdownOption;
    onChange: (category: any, info: any) => void;
    padded?: boolean;
    onUpdate?: () => void;
    menuComponent?: React.ComponentType<MenuProps<any>>;
    optionComponent?: React.ComponentType<OptionProps<any>>;
    isMulti?: boolean;
    hideSelectedOptions?: boolean;
    closeMenuOnSelect?: boolean;
    blurInputOnSelect?: boolean;
    placeholder?: string;
    controlShouldRenderValue?: boolean;
    isOptionSelected?: (option: DropdownOption) => boolean;
    value?: DropdownOption[] | GroupedDropdownOption[];
    style?: React.CSSProperties;
}

const Dropdown: React.FC<Props> = props => {
    const dropdownMenuRef = useRef(null);

    useEffect(() => {
        const resizeListener = () => dropdownMenuRef.current.blur();
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    return (
        <SelectWrapper
            autoFocus
            style={props.style}
            padded={props.padded}
            className='react-select'
            classNamePrefix='react-select'
            ref={dropdownMenuRef}
            options={props.options}
            defaultValue={props.defaultOption}
            styles={{
                menu: (base: any) => ({ ...base, fontSize: 12 }),
                menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                container: (base: any) => ({ ...base, ...props.style }),
            }}
            menuPortalTarget={document.body}
            components={{
                Menu: props.menuComponent || components.Menu,
                Option: props.optionComponent || components.Option,
            }}
            onChange={props.onChange}
            onUpdate={props.onUpdate}
            isMulti={props.isMulti}
            placeholder={props.placeholder}
            hideSelectedOptions={!props.isMulti}
            closeMenuOnSelect={!props.isMulti}
            blurInputOnSelect={!props.isMulti}
            controlShouldRenderValue={!props.isMulti}
            isOptionSelected={props.isOptionSelected}
            value={props.value}
            size={props.size}
        />
    );
};

// STYLES //
const SelectWrapper = styled(Select)<{ padded: boolean; size: 'bg' | 'sm' }>`
    font-family: 'Open Sans';
    font-size: ${({ size }) => size === 'sm' && '12px'};
    .react-select__control {
        height: ${({ size }) => (size === 'bg' ? '45px' : size === 'sm' ? '38px' : 'initial')};
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

export default Dropdown;
