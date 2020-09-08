// REACT //
import React, { useState, useCallback, useEffect } from 'react';

// COMPONENTS //
import { usePlaidLink } from 'react-plaid-link';
import { Button } from 'react-bootstrap';
import '../../assets/css/index.css';

interface Props {
    refreshResources: () => void;
}

const PlaidLinkButton: React.FC<Props> = props => {
    const [accountsInfo, setAccountsInfo] = useState({ token: '', metadata: null });
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState('');

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

    const onSuccess = useCallback(async (token: string, metadata: any) => {
        setAccountsInfo({ token: token, metadata: metadata });
        props.refreshResources();
        setAccountsLoading(true);
    }, []);

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess: onSuccess });

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
