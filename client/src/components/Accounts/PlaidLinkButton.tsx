// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { usePlaidLink } from 'react-plaid-link';
import styled from 'styled-components';
import Button from '../shared/Button';

// CONTEXT //
import { ResourcesContext } from '../../App';

interface Props {
    token: string;
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

    const { open, ready, error } = usePlaidLink({ token: props.token, onSuccess: onSuccess });

    return (
        <ButtonWrapper>
            <Button
                child='+ Account'
                disabled={!ready || error !== null}
                onClick={() => open()}
                variant='primary'
                style={{ maxWidth: 600, width: 'calc(100% - 40px)' }}
            />
        </ButtonWrapper>
    );
};

// STYLES //
const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px auto;
    width: 100%;
`;

export default PlaidLinkButton;
