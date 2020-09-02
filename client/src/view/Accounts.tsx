// REACT //
import React from 'react';

// ROUTER //
import { Redirect } from 'react-router';

// REDUX //
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// COMPONENTS //
import PlaidLinkButton from '../components/Accounts/PlaidLinkButton';

const Accounts: React.FC = () => {
    const stateEmail = useSelector((state: RootState) => state.email);

    if (!stateEmail && !sessionStorage.getItem('email')) {
        return <Redirect to='/signin' />;
    }
    return (
        <>
            <PlaidLinkButton />
        </>
    );
};

export default Accounts;
