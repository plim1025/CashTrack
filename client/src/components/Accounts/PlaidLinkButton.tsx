// REACT //
import React, { useState, useCallback, useEffect, useContext } from 'react';

// COMPONENTS //
import { usePlaidLink } from 'react-plaid-link';
import { Button } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

const PlaidLinkButton: React.FC = () => {
    const [accountsInfo, setAccountsInfo] = useState({ token: '', metadata: null });
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState(null);
    const { refresh } = useContext(ResourcesContext);

    useEffect(() => {
        const getLinkToken = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URI}/api/plaid/create_link_token`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    }
                );
                if (!response.ok) {
                    throw Error('Bad response from server');
                }
                const newLinkToken = await response.json();
                setLinkToken(newLinkToken);
            } catch (error) {
                throw Error(`Error fetching link token: ${error}`);
            }
        };
        getLinkToken();
    }, []);

    const onSuccess = useCallback(async (token: string, metadata: any) => {
        setAccountsInfo({ token: token, metadata: metadata });
        refresh('Fetching account information...');
        setAccountsLoading(true);
    }, []);

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess: onSuccess });

    const setPlaidAccounts = async (token: string, metadata: any) => {
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
        } catch (error) {
            throw Error(`Error setting plaid account: ${error}`);
        }
    };

    if (accountsLoading) {
        const promise = setPlaidAccounts(accountsInfo.token, accountsInfo.metadata).then(() =>
            setAccountsLoading(false)
        );
        throw promise;
    }
    return (
        <Button disabled={!ready} onClick={() => open()} size='sm' variant='primary'>
            Add Account
        </Button>
    );
};

export default PlaidLinkButton;
