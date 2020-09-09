// REACT //
import React from 'react';

// COMPONENTS //
import PlaidLinkButton from '../components/Accounts/PlaidLinkButton';

interface Props {
    refreshResources: () => void;
}

const Accounts: React.FC<Props> = props => {
    return <>{/* <PlaidLinkButton refreshResources={() => props.refreshResources()} /> */}</>;
};

export default Accounts;
