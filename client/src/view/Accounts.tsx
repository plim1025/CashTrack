// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import PlaidLinkButton from '../components/Accounts/PlaidLinkButton';
import FallbackSpinner from '../components/shared/FallbackSpinner';

const Accounts: React.FC = () => {
    const [linkToken, setLinkToken] = useState(null);

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

    if (!linkToken) {
        return <FallbackSpinner backdrop show />;
    }
    return <PlaidLinkButton linkToken={linkToken} />;
};

export default Accounts;
