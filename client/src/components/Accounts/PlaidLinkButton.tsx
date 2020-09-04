import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from 'react-bootstrap';
import '../../assets/css/index.css';

const PlaidLinkButton: React.FC = () => {
    const [linkToken, setLinkToken] = useState('');
    const [accountsInfo, setAccountsInfo] = useState({ token: '', metadata: null });
    const [accountsLoading, setAccountsLoading] = useState(false);

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
                const newLinkToken = await response.json();
                setLinkToken(newLinkToken);
            } catch (error) {
                console.log(`Error getting link token: ${error}`);
            }
        };
        getLinkToken();
    }, []);

    const setPlaidAccounts = async (token: string, metadata: any) => {
        try {
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
        } catch (error) {
            console.log(`Error setting plaid account: ${error}`);
        }
    };

    const onSuccess = useCallback(async (token: string, metadata: any) => {
        setAccountsInfo({ token: token, metadata: metadata });
        setAccountsLoading(true);
    }, []);

    const config = {
        token: linkToken,
        onSuccess: onSuccess,
    };

    const { open, ready, error } = usePlaidLink(config);

    if (accountsLoading) {
        const promise = setPlaidAccounts(accountsInfo.token, accountsInfo.metadata).then(() =>
            setAccountsLoading(false)
        );
        throw promise;
    }
    return (
        <Button
            // style={{ background: '#0a85ea', border: '#0a85ea' }}
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
