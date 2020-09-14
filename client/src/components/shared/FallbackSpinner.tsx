// REACT //
import React from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
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
                    <Spinner className={css(ss.wrapper)} variant='primary' animation='border' />
                    {props.backdrop ? <div className={css(ss.backdrop)} /> : null}
                </>
            ) : null}
        </>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -20,
        zIndex: 9999,
    },
    backdrop: {
        opacity: 0.5,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9998,
        width: '100vw',
        height: '100vh',
        background: '#000',
    },
});

export default FallbackSpinner;
