import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Button from 'react-bootstrap/Button';
import '../../assets/css/index.css';

const PlaidLinkButton: React.FC = () => {
    const [linkToken, setLinkToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const response = await fetch(`${process.env.BACKEND_URI}/api/plaid/create_link_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const newLinkToken = await response.json();
            setLinkToken(newLinkToken);
        };
        getLinkToken();
    }, []);

    const onSuccess = useCallback(async (token, metadata) => {
        await fetch(`${process.env.BACKEND_URI}/api/plaid/set_account`, {
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
    }, []);

    const onEvent = useCallback((eventName, metadata) => {
        console.log('onEvent', eventName, metadata);
    }, []);

    const onExit = useCallback((err, metadata) => {
        console.log('onExit', err, metadata);
    }, []);

    const config = {
        token: linkToken,
        onSuccess: onSuccess,
        onEvent: onEvent,
        onExit: onExit,
    };

    const { open, ready, error } = usePlaidLink(config);

    return (
        <Button
            style={{ background: '#0a85ea', border: '#0a85ea' }}
            onClick={() => open()}
            disabled={!ready}
            variant='primary'
            size='sm'
        >
            Add Account
        </Button>
    );
};

export default PlaidLinkButton;
