// REACT //
import React, { useState } from 'react';

// ROUTER //
import { Redirect } from 'react-router';

// REDUX //
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// COMPONENTS //
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

interface Props {
    history: any;
}

const Register: React.FC<Props> = props => {
    const stateEmail = useSelector((state: RootState) => state.email);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ type: '', message: '' });

    const register = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
            setAlert({ type: 'danger', message: 'All fields must be filled in.' });
            return;
        }
        try {
            const registrationInfo = JSON.stringify({ email: email, password: password });
            const response = await fetch(`${process.env.BACKEND_URI}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: registrationInfo,
            });
            const parsedResponse = await response.json();
            if (parsedResponse.error) {
                setAlert({ type: 'danger', message: parsedResponse.error });
            } else {
                setAlert({ type: 'success', message: 'Account created. ' });
            }
            props.history.push('/home');
        } catch {
            setAlert({ type: 'danger', message: 'Error in creating account.' });
        }
    };

    if (stateEmail || sessionStorage.getItem('email')) {
        return <Redirect to='/home' />;
    }
    return (
        <Form>
            <h2>Register</h2>
            {alert.message ? (
                <Alert variant={alert.type}>
                    {alert.message}
                    {alert.type === 'success' ? <Alert.Link href='/login'>Login</Alert.Link> : null}
                </Alert>
            ) : null}
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
            <Button onClick={register} variant='primary' type='submit'>
                Submit
            </Button>
        </Form>
    );
};

export default Register;
