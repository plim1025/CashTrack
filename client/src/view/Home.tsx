// REACT //
import React from 'react';

// ROUTER //
import { Redirect, withRouter } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadEmail } from '../redux/Actions';
import { RootState } from '../redux/Store';

// COMPONENTS //
import Button from 'react-bootstrap/Button';

interface Props {
    history: any;
}

const Home: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const stateEmail = useSelector((state: RootState) => state.email);

    const logout = () => {
        if (stateEmail) {
            dispatch(loadEmail(''));
        } else if (sessionStorage.getItem('email')) {
            sessionStorage.setItem('email', '');
        }
        props.history.push('/home');
    };

    if (!stateEmail && !sessionStorage.getItem('email')) {
        return <Redirect to='/login' />;
    }
    return (
        <>
            <div>{stateEmail || sessionStorage.getItem('email')}</div>
            <Button onClick={logout} variant='outline-dark'>
                Logout
            </Button>
        </>
    );
};

export default withRouter(Home);
