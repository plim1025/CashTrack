// REACT //
import React, { useReducer, useEffect, useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Form, Spinner } from 'react-bootstrap';
import Button from '../components/shared/Button';
import ErrorMessage from '../components/shared/ErrorMessage';

// CONTEXT //
import { ResourcesContext } from '../App';

// UTILS //
import { updateUser, verifyPassword, updatePassword } from '../components/Settings/SettingsUtils';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_NOTIFICATION'; notification: string }
    | { type: 'SET_OLD_PASSWORD'; oldPassword: string }
    | { type: 'SET_NEW_PASSWORD'; newPassword: string }
    | { type: 'SET_CONFIRMED_PASSWORD'; confirmedPassword: string }
    | { type: 'CLEAR_PASSWORDS' }
    | { type: 'SET_ERROR'; message: string; status: string }
    | { type: 'HIDE_ERROR' };

interface ReducerState {
    loading: boolean;
    notification: string;
    oldPassword: string;
    newPassword: string;
    confirmedPassword: string;
    error: {
        show: boolean;
        message: string;
        status: string;
    };
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_NOTIFICATION':
            return { ...state, notification: action.notification };
        case 'SET_OLD_PASSWORD':
            return { ...state, oldPassword: action.oldPassword };
        case 'SET_NEW_PASSWORD':
            return { ...state, newPassword: action.newPassword };
        case 'SET_CONFIRMED_PASSWORD':
            return { ...state, confirmedPassword: action.confirmedPassword };
        case 'CLEAR_PASSWORDS':
            return { ...state, oldPassword: '', newPassword: '', confirmedPassword: '' };
        case 'SET_ERROR':
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            return {
                ...state,
                error: { show: true, message: action.message, status: action.status },
            };
        case 'HIDE_ERROR':
            return { ...state, error: { ...state.error, show: false } };
        default:
            return state;
    }
};

let errorTimeout: ReturnType<typeof setTimeout>;

const Settings: React.FC = () => {
    const { user, setUser } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        notification: user.notification,
        oldPassword: '',
        newPassword: '',
        confirmedPassword: '',
        error: {
            show: false,
            message: '',
            status: '',
        },
    });

    const handleChangeNotification = async (frequency: string) => {
        dispatch({ type: 'SET_NOTIFICATION', notification: frequency });
        setUser({ ...user, notification: frequency });
        await updateUser(frequency);
    };

    const handleSubmitPassword = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', loading: true });
        const success = await verifyPassword(state.oldPassword);
        if (!success) {
            dispatch({
                type: 'SET_ERROR',
                message: 'Old password is incorrect',
                status: 'danger',
            });
        } else {
            if (!state.newPassword && !state.confirmedPassword) {
                dispatch({
                    type: 'SET_ERROR',
                    message: 'Password cannot be blank',
                    status: 'danger',
                });
            } else if (state.newPassword !== state.confirmedPassword) {
                dispatch({
                    type: 'SET_ERROR',
                    message: 'Passwords do not match',
                    status: 'danger',
                });
            } else {
                await updatePassword(state.newPassword);
                dispatch({ type: 'CLEAR_PASSWORDS' });
                dispatch({
                    type: 'SET_ERROR',
                    message: 'Password successfully updated',
                    status: 'success',
                });
            }
        }
        dispatch({ type: 'SET_LOADING', loading: false });
        errorTimeout = setTimeout(() => dispatch({ type: 'HIDE_ERROR' }), 3000);
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <Wrapper>
            <FormWrapper>
                <NotificationForm>
                    <SectionTitle>Email Notifications</SectionTitle>
                    <Form.Check
                        inline
                        label='Daily'
                        type='radio'
                        id='1'
                        checked={state.notification === 'Daily'}
                        onChange={() => handleChangeNotification('Daily')}
                    />
                    <Form.Check
                        inline
                        label='Weekly'
                        type='radio'
                        id='2'
                        checked={state.notification === 'Weekly'}
                        onChange={() => handleChangeNotification('Weekly')}
                    />
                    <Form.Check
                        inline
                        label='Monthly'
                        type='radio'
                        id='3'
                        checked={state.notification === 'Monthly'}
                        onChange={() => handleChangeNotification('Monthly')}
                    />
                </NotificationForm>
                <SectionTitle>Reset Password</SectionTitle>
                <Form.Group>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={state.oldPassword}
                        onChange={e =>
                            dispatch({ type: 'SET_OLD_PASSWORD', oldPassword: e.target.value })
                        }
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={state.newPassword}
                        onChange={e =>
                            dispatch({ type: 'SET_NEW_PASSWORD', newPassword: e.target.value })
                        }
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={state.confirmedPassword}
                        onChange={e =>
                            dispatch({
                                type: 'SET_CONFIRMED_PASSWORD',
                                confirmedPassword: e.target.value,
                            })
                        }
                    />
                </Form.Group>
                <Button
                    child={
                        state.loading ? <Spinner as='span' animation='border' size='sm' /> : 'Save'
                    }
                    onClick={handleSubmitPassword}
                    variant='primary'
                    submit
                    block
                    style={{ height: 40, marginBottom: 20 }}
                />
                <ErrorMessage
                    error={state.error.show}
                    errorMessage={state.error.message}
                    type={state.error.status}
                />
            </FormWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const FormWrapper = styled(Form)`
    margin-top: 20px;
    max-width: 600px;
    width: calc(100% - 40px);
`;

const NotificationForm = styled(Form.Group)`
    display: flex;
    flex-direction: column;
`;

const SectionTitle = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 1rem;
`;

export default Settings;
