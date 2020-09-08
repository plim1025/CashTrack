// REACT //
import React from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
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
            className={css(ss.wrapper)}
            style={{ top: props.error ? 10 : -200 }}
            variant={props.type || 'danger'}
        >
            {props.errorMessage}
            {props.link ? (
                <Alert.Link className={css(ss.link)} onClick={() => props.history.push(props.link)}>
                    {props.linkTitle}
                </Alert.Link>
            ) : null}
        </Alert>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        // @ts-ignore
        position: 'absolute !important',
        transition: 'all .2s ease-in-out !important',
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 'auto 0',
    },
    link: {
        ':hover': {
            textDecoration: 'underline',
        },
    },
});

export default Error;
