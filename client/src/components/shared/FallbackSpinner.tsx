// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

interface Props {
    show: boolean;
    backdrop?: boolean;
    message?: string;
}

const FallbackSpinner: React.FC<Props> = props => {
    return (
        <>
            {props.show ? (
                <>
                    <Wrapper>
                        <SpinnerWrapper variant='primary' animation='border' />
                        {props.message ? <Message>{props.message}</Message> : null}
                    </Wrapper>
                    {props.backdrop ? <Backdrop /> : null}
                </>
            ) : null}
        </>
    );
};

// STYLES //
const Wrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 50%;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;

const SpinnerWrapper = styled(Spinner)``;

const Message = styled.div`
    font-weight: 700;
    margin-top: 10px;
    opacity: 0.75;
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
