// REACT //
import React from 'react';

// COMPONENTS //
import { Modal, Table } from 'react-bootstrap';

interface Props {
    show: boolean;
    close: () => void;
}

const ViewModal: React.FC<Props> = props => {
    return (
        <Modal centered show={props.show} onHide={() => props.close()}>
            <Modal.Header closeButton>
                <h4>Transactions</h4>
            </Modal.Header>
            <Modal.Body>
                <Table bordered />
            </Modal.Body>
        </Modal>
    );
};

export default ViewModal;
