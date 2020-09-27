// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { Modal } from 'react-bootstrap';
import Button from '../shared/Button';

// CONTEXT //
import { ResourcesContext } from '../../App';

// UTIL //
import { deleteAccounts } from './AccountsUtils';

interface Props {
    setLoading: (loading: boolean) => void;
    show: boolean;
    close: () => void;
    batchID: string;
}

const AccountDeleteModal: React.FC<Props> = props => {
    const { accounts, setAccounts } = useContext(ResourcesContext);

    const handleSubmit = async () => {
        props.setLoading(true);
        await deleteAccounts(props.batchID);
        setAccounts(accounts.filter(account => account.batchID !== props.batchID));
        props.setLoading(false);
        props.close();
    };

    return (
        <Modal centered show={props.show}>
            <Modal.Body>
                <div>Are you sure you want to log out of this account?</div>
                <div style={{ marginTop: 10 }}>Transactions from this account will be deleted</div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    child='Cancel'
                    onClick={() => props.close()}
                    variant='secondary'
                    size='sm'
                />
                <br />
                <Button child='Sign Out' onClick={handleSubmit} variant='danger' size='sm' />
            </Modal.Footer>
        </Modal>
    );
};

export default AccountDeleteModal;
