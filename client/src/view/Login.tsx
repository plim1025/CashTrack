// REACT //
import React, { useState } from 'react';

// ROUTER //
import { Redirect, withRouter } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadEmail } from '../redux/Actions';
import { RootState } from '../redux/Store';

// COMPONENTS //
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

interface Props {
    history: any;
}

const Login: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const stateEmail = useSelector((state: RootState) => state.email);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const login = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
            setError('All fields must be filled in.');
            return;
        }
        try {
            const loginInfo = JSON.stringify({ email: email, password: password });
            const response = await fetch(`${process.env.BACKEND_URI}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: loginInfo,
            });
            const parsedResponse = await response.json();
            if (rememberMe) {
                dispatch(loadEmail(parsedResponse.email));
            } else {
                sessionStorage.setItem('email', email);
            }
            props.history.push('/home');
        } catch {
            setError('Email and password do not match.');
        }
    };

    if (stateEmail || sessionStorage.getItem('email')) {
        return <Redirect to='/home' />;
    }
    return (
        <Form>
            <h2>Login</h2>
            {error ? <Alert variant='danger'>{error}</Alert> : null}
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    onChange={e => setEmail(e.target.value)}
                    type='email'
                    placeholder='Enter email'
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    onChange={e => setPassword(e.target.value)}
                    type='password'
                    placeholder='Password'
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    onChange={(e: any) => setRememberMe(e.target.checked)}
                    type='checkbox'
                    label='Remember me'
                />
            </Form.Group>
            <Button onClick={login} variant='primary' type='submit'>
                Submit
            </Button>
            <span>New to CashTrack?</span>
            <Button onClick={() => props.history.push('/register')} variant='link'>
                Register here
            </Button>
        </Form>
    );
};

export default withRouter(Login);
