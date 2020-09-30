// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';

const BadRequest: React.FC = () => {
    return <Wrapper>This page doesn&apos;t exist :(</Wrapper>;
};

// STYLES //
const Wrapper = styled.h3`
    left: 50%;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export default BadRequest;
