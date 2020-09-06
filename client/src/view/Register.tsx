// REACT //
import React, { useState, useEffect } from 'react';

// ROUTER //
import { Redirect } from 'react-router';

// REDUX //
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Button, Card, Form } from 'react-bootstrap';
import Error from '../components/shared/Error';

interface Props {
    history: any;
}

const Register: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const globalEmail = useSelector((redux: RootState) => redux.email);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorInfo, setErrorInfo] = useState({ type: '', message: '' });

    const register = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
            setError(true);
            setErrorInfo({ type: 'danger', message: 'All fields must be filled in.' });
        } else {
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
                    setError(true);
                    setErrorInfo({ type: 'danger', message: parsedResponse.error });
                } else {
                    setError(true);
                    setErrorInfo({ type: 'success', message: 'Account created. ' });
                    return;
                }
            } catch {
                setError(true);
                setErrorInfo({ type: 'danger', message: 'Error in creating account.' });
            }
        }
        errorTimeout = setTimeout(() => setError(false), 3000);
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    if (globalEmail || sessionStorage.getItem('email')) {
        return <Redirect to='/home' />;
    }
    return (
        <div className={css(ss.wrapper)}>
            <Error
                error={error}
                type={errorInfo.type}
                errorMessage={errorInfo.message}
                link={errorInfo.type === 'success' ? '/signin' : null}
                linkTitle={errorInfo.type === 'success' ? 'Sign In' : null}
                history={props.history}
            />
            <Card className={css(ss.card)}>
                <svg
                    className={css(ss.logo)}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1698.4 493'
                >
                    <path d='M470.9,13.2C450,4.7,422.7,0,394,0s-56,4.7-76.9,13.2c-31.8,13-39.6,31.1-40.9,42.8H276V217.8c-6.5-.5-13.2-.8-20-.8s-13.5.3-20,.8V136h-.2c-1.3-11.7-9-29.8-40.9-42.8C174,84.7,146.7,80,118,80S62,84.7,41.1,93.2C5.3,107.8,0,128.8,0,140V376c0,11.2,5.3,32.2,41.1,46.8C62,431.3,89.3,436,118,436c6.8,0,13.5-.3,20.1-.8.7,11.6,7.5,30.9,41,44.6C200,488.3,227.3,493,256,493s56-4.7,76.9-13.2C368.7,465.2,374,444.2,374,433v-.8c6.6.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2C506.7,405.2,512,384.2,512,373V60C512,48.8,506.7,27.8,470.9,13.2ZM394,40c46.2,0,72.9,13.5,77.6,20-4.7,6.5-31.4,20-77.6,20s-72.9-13.5-77.6-20C321.1,53.5,347.8,40,394,40ZM256,257c46.2,0,72.9,13.5,77.6,20h-.1l-.3.3-.3.4-.3.3-.4.4-.3.3-.5.4-.4.4a1,1,0,0,0-.5.4l-.5.3-.6.5-.6.3-.7.5-.6.3-.8.5-.6.4-.9.5-.6.3-1.1.5-.6.4-1.4.6-.4.2-2,.9h-.3l-1.7.7-.8.3-1.4.6-1,.3-1.4.5-1,.3-1.4.5-1.1.4-1.5.4-1.2.3-1.5.5-1.3.3-1.6.4-1.3.3-1.6.4-1.4.3-1.7.4-1.5.3-1.8.3-1.5.3-1.8.3-1.6.3-1.9.3-1.6.2-2,.2-1.7.2-2.1.3h-1.7l-2.1.2-1.8.2h-4l-2.5.2H245.7l-2.5-.2h-4l-1.8-.2-2.1-.2h-1.7l-2.1-.3-1.7-.2-2-.2-1.6-.2-1.9-.3-1.6-.3-1.8-.3-1.5-.3-1.8-.3-1.5-.3-1.7-.4-1.4-.3-1.6-.4-1.3-.3-1.6-.4-1.3-.3-1.5-.5-1.2-.3-1.5-.4-1.1-.4-1.4-.5-1-.3L198,288l-.9-.3-1.4-.6-.8-.3-1.7-.7h-.4l-1.9-.9-.4-.2-1.4-.6-.6-.4-1.1-.5-.6-.3-.9-.5-.7-.4-.7-.5-.6-.3-.7-.5-.6-.3-.6-.5-.5-.3a1,1,0,0,0-.5-.4c-.1-.2-.3-.3-.4-.4l-.5-.4-.3-.3-.4-.4-.3-.3-.3-.4-.3-.3h-.1C183.1,270.5,209.8,257,256,257ZM118,120c46.2,0,72.9,13.5,77.6,20-4.7,6.5-31.4,20-77.6,20s-72.9-13.5-77.6-20C45.1,133.5,71.8,120,118,120Zm20,275.1c-6.5.6-13.2.9-20,.9-47.8,0-74.7-14.5-78-20.6V345.3l1.1.5C62,354.3,89.3,359,118,359c6.8,0,13.4-.3,20-.8ZM138,280v38.1c-6.5.6-13.2.9-20,.9-47.9,0-74.8-14.5-78-20.7v-33l1.1.5C62,274.3,89.3,279,118,279c6.8,0,13.5-.3,20-.8,0,.6.1,1.2.1,1.8Zm-20-41c-47.9,0-74.8-14.5-78-20.7v-32l1.1.5C62,195.3,89.3,200,118,200s56-4.7,76.9-13.2l1.1-.5v32C192.8,224.5,165.9,239,118,239ZM334,432.4c-3.3,6.1-30.2,20.6-78,20.6s-74.7-14.5-78-20.6V400.3l1.1.5C200,409.3,227.3,414,256,414s56-4.7,76.9-13.2l1.1-.5Zm0-79.1c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-30l1.1.5C200,332.3,227.3,337,256,337s56-4.7,76.9-13.2l1.1-.5Zm138,19.1c-3.3,6.1-30.2,20.6-78,20.6-6.8,0-13.5-.3-20-.9V355.2c6.6.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2l1.1-.5Zm0-77.1c-3.2,6.2-30.1,20.7-78,20.7-6.8,0-13.5-.3-20-.9V280h-.1c0-.6.1-1.2.1-1.8,6.5.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2l1.1-.5Zm0-77c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-33l1.1.5C338,194.3,365.3,199,394,199s56-4.7,76.9-13.2l1.1-.5Zm0-80c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-32l1.1.5C338,115.3,365.3,120,394,120s56-4.7,76.9-13.2l1.1-.5Z' />
                    <text className={css(ss.logoText)} transform='translate(665 297)'>
                        CashTrack
                    </text>
                </svg>
                <Form>
                    <h3>Register</h3>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} type='email' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} type='password' />
                    </Form.Group>
                    <div className={css(ss.register)}>
                        <span>Already have an account?</span>
                        <Button onClick={() => props.history.push('/signin')} variant='link'>
                            Sign In
                        </Button>
                    </div>
                    <Button onClick={register} variant='primary' type='submit' block>
                        Register
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        position: 'relative',
        marginTop: 'auto',
        marginBottom: 'auto',
        width: 400,
        padding: 20,
    },
    logo: {
        position: 'absolute',
        transform: 'translateY(-150%)',
        fill: '#343a40',
        height: 70,
        width: 350,
    },
    logoText: {
        fontSize: 200,
        fontFamily: 'Open Sans',
        fontWeight: 600,
    },
    register: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
    },
});

export default Register;
