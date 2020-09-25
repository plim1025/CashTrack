// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { usePlaidLink } from 'react-plaid-link';
import { Button } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

interface Props {
    linkToken: string;
}

const PlaidLinkButton: React.FC<Props> = props => {
    const { refresh } = useContext(ResourcesContext);

    const onSuccess = async (token: string, metadata: any) => {
        refresh('Fetching account information...');
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/plaid/set_account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    publicToken: token,
                    batchID: metadata.link_session_id,
                    institution: metadata.institution.name,
                    accounts: metadata.accounts,
                }),
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
        } catch (err) {
            throw Error(`Error setting plaid account: ${err}`);
        }
    };

    const { open, ready, error } = usePlaidLink({ token: props.linkToken, onSuccess: onSuccess });

    return (
        <Button
            disabled={!ready || error !== null}
            onClick={() => open()}
            size='sm'
            variant='primary'
        >
            Add Account
        </Button>
    );
};

export default PlaidLinkButton;
