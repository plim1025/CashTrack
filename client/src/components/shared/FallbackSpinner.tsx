// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

interface Props {
    show: boolean;
    backdrop: boolean;
}

const FallbackSpinner: React.FC<Props> = props => {
    return (
        <>
            {props.show ? (
                <>
                    <SpinnerWrapper variant='primary' animation='border' />
                    {props.backdrop ? <Backdrop /> : null}
                </>
            ) : null}
        </>
    );
};

// STYLES //
const SpinnerWrapper = styled(Spinner)`
    left: 50%;
    margin-left: -20;
    margin-top: -20;
    position: fixed;
    top: 50%;
    z-index: 9999;
`;

const Backdrop = styled.div`
    background: #000;
    height: 100vh;
    left: 0;
    opacity: 0.5;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 9998;
`;
export default FallbackSpinner;
