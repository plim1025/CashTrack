// REACT //
import React from 'react';

// ROUTER //
import { Link } from 'react-router-dom';

const LoadHeader: React.FC = () => {
    return (
        <>
            <Link to='/home'>Home</Link>
            <Link to='/transactions'>Transactions</Link>
            <Link to='/trends'>Trends</Link>
            <Link to='/accounts'>Accounts</Link>
        </>
    );
};

export default LoadHeader;
