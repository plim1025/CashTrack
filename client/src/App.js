import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const App = () => {
    const [linkToken, setLinkToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const response = await fetch(
                'http://localhost:3000/api/plaid/create_link_token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );
            const linkToken = await response.json();
            setLinkToken(linkToken);
        };
        getLinkToken();
    }, []);

    const onSuccess = useCallback(async (token, metadata) => {
        console.log(metadata);
        await fetch('http://localhost:3000/api/plaid/set_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                publicToken: token,
                institution: metadata.institution.name,
                accounts: metadata.accounts
            }),
        });
        // window.location = 'http://localhost:3000';
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
        <button onClick={() => open()} disabled={!ready}>
            Connect a bank account
        </button>
    );
};

export default App;
