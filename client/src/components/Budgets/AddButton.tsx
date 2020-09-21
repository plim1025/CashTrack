// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

interface Props {
    openAddModal: () => void;
}

const AddButton: React.FC<Props> = props => {
    return <ButtonWrapper onClick={() => props.openAddModal()}>+ Budget</ButtonWrapper>;
};

const ButtonWrapper = styled(Button)`
    height: 40px;
    justify-content: center;
    @media (max-width: 750px) {
        width: 60px;
    }
    &&& {
        align-items: center;
        display: flex;
        font-weight: 700;
        line-height: inherit;
        margin: 20px;
        padding-left: 0.375rem;
        padding-right: 0.375rem;
        white-space: nowrap;
        width: calc(25% - 40px);
    }
`;

export default AddButton;
