/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useEffect, useContext } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Button, Modal } from 'react-bootstrap';
import Error from '../shared/Error';

interface Props {
    toggled: boolean;
    close: () => void;
}

const CategoryModal: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const [error, setError] = useState({ show: false, message: '' });

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <Modal
            centered
            onHide={() => props.close()}
            show={props.toggled}
            dialogClassName='category-modal'
        >
            <Modal.Header closeButton>Test</Modal.Header>
            <Error error={error.show} errorMessage={error.message} />
        </Modal>
    );
};

// STYLES //
const ss = StyleSheet.create({});

export default CategoryModal;
