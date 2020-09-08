import { LOAD_EMAIL, LOAD_SUBPAGE } from './Constants';

export const loadEmail = (email: string): { type: string; email: string } => ({
    type: LOAD_EMAIL,
    email: email,
});

export const loadSubpage = (subpage: string): { type: string; subpage: string } => ({
    type: LOAD_SUBPAGE,
    subpage: subpage,
});

export const logout = (history: any) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        try {
            await fetch(`${process.env.BACKEND_URI}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.log(`Error logging out: ${error}`);
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
