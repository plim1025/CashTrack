// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Alert } from 'react-bootstrap';

interface Props {
    error: boolean;
    errorMessage: string;
    type?: string;
    link?: string;
    linkTitle?: string;
    history?: any;
}

const Error: React.FC<Props> = props => {
    return (
        <AlertWrapper variant={props.type || 'danger'} display={props.error}>
            {props.errorMessage}
            {props.link ? (
                <AlertLinkWrapper onClick={() => props.history.push(props.link)}>
                    {props.linkTitle}
                </AlertLinkWrapper>
            ) : null}
        </AlertWrapper>
    );
};

// STYLES //
const AlertWrapper = styled(({ display, ...rest }) => <Alert {...rest} />)<{ display: boolean }>`
    &&& {
        position: fixed;
        transition: all 0.2s ease-in-out;
    }
    left: 50%;
    margin: auto 0;
    top: ${({ display }) => (display ? '10px' : '-200px')};
    transform: translateX(-50%);
`;

const AlertLinkWrapper = styled(Alert.Link)`
    & :hover {
        text-decoration: underline;
    }
`;

export default Error;
