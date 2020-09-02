// REACT //
import React from 'react';

// ROUTER //
import { Redirect } from 'react-router';

// REDUX //
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const Transactions: React.FC = () => {
    const stateEmail = useSelector((state: RootState) => state.email);

    if (!stateEmail && !sessionStorage.getItem('email')) {
        return <Redirect to='/signin' />;
    }
    return <></>;
};

export default Transactions;
