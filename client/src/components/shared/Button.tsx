// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

interface Props {
    size?: 'sm' | 'lg';
    variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | 'info'
        | 'light'
        | 'dark'
        | 'link';
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
    child?: React.ReactNode | string;
    disabled?: boolean;
    style?: React.CSSProperties;
    submit?: boolean;
    block?: boolean;
}

const Header: React.FC<Props> = props => {
    return (
        <ButtonWrapper
            block={props.block || false}
            type={props.submit ? 'submit' : null}
            disabled={props.disabled || false}
            size={props.size || null}
            variant={props.variant || 'primary'}
            onClick={props.onClick || null}
            style={props.style || null}
        >
            {props.child || null}
        </ButtonWrapper>
    );
};

// STYLES //
const ButtonWrapper = styled(Button)`
    &&& {
        align-items: center;
        display: flex;
        font-weight: 700;
        justify-content: center;
        padding: 4px 10px;
    }
`;

export default Header;
