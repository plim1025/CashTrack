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
                    credentials: 'include',
                }
            );
            const linkToken = await response.json();
            console.log('link token: ', linkToken);
            setLinkToken(linkToken);
        };
        getLinkToken();
    }, []);

    const onSuccess = useCallback(async (token, metadata) => {
        await fetch('/set_access_token', {
            method: 'POST',
            body: JSON.stringify({ publicToken: token }),
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
        <button onClick={() => open()} disabled={!ready}>
            Connect a bank account
        </button>
    );
};

export default App;
