// REACT //
import React from 'react';

// COMPONENTS //
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
        <Alert
            style={{
                position: 'absolute',
                top: props.error ? 10 : -200,
                transition: 'all .2s ease-in-out',
                left: '50%',
                transform: 'translateX(-50%)',
                margin: 'auto 0',
            }}
            variant={props.type || 'danger'}
        >
            {props.errorMessage}
            {props.link ? (
                <Alert.Link
                    onClick={() => props.history.push(props.link)}
                    style={{ ':hover': { textDecoration: 'underline' } }}
                >
                    {props.linkTitle}
                </Alert.Link>
            ) : null}
        </Alert>
    );
};

export default Error;
