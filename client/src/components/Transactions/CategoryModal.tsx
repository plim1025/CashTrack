// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
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
        <Modal centered onHide={() => props.close()} show={props.toggled}>
            <Modal.Header closeButton />
            <Error error={error.show} errorMessage={error.message} />
        </Modal>
    );
};

export default CategoryModal;
