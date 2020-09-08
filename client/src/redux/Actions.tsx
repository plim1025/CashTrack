import { LOAD_EMAIL, LOAD_SUBPAGE } from './Constants';
import { AppThunk } from '../types';

export const loadEmail = (email: string): { type: string; email: string } => ({
    type: LOAD_EMAIL,
    email: email,
});

export const loadSubpage = (subpage: string): { type: string; subpage: string } => ({
    type: LOAD_SUBPAGE,
    subpage: subpage,
});

export const logout = (history: any): AppThunk => {
    return async (dispatch, getState): Promise<any> => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
        } catch (error) {
            throw Error(`Error logging out: ${error}`);
        }
        if (getState().email) {
            dispatch(loadEmail(''));
        }
        if (sessionStorage.getItem('email')) {
            sessionStorage.setItem('email', '');
        }
        dispatch(loadSubpage('home'));
        history.push('/signin');
    };
};
