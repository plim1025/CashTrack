import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { loadEmail } from '../redux/Actions';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const login = async (e: any) => {
        e.preventDefault();
        const loginInfo = JSON.stringify({ email: email, password: password });
        const response = await fetch(`${process.env.BACKEND_URI}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: loginInfo,
        });
        const parsedResponse = await response.json();
        if (parsedResponse.email) {
            dispatch(loadEmail(email));
        } else {
            setError(true);
        }
    };

    return (
        <Form>
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
                <Form.Check type='checkbox' label='Remember me' />
            </Form.Group>
            <Button onClick={login} variant='primary' type='submit'>
                Submit
            </Button>
        </Form>
    );
};

export default Login;
