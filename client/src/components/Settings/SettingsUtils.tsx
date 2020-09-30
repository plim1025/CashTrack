export const updateUser = async (notification: string): Promise<void> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                notification: notification,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error fetching user: ${error}`);
    }
};

export const verifyPassword = async (password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${process.env.BACKEND_URI}/api/user/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                password: password,
            }),
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch (error) {
        throw Error(`Error verifying password: ${error}`);
    }
};

export const updatePassword = async (newPassword: string, userID?: string): Promise<void> => {
    try {
        let body;
        if (userID) {
            body = JSON.stringify({ password: newPassword, id: userID });
        } else {
            body = JSON.stringify({ password: newPassword });
        }
        const response = await fetch(`${process.env.BACKEND_URI}/api/user/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: body,
        });
        if (!response.ok) {
            throw Error('Bad response from server');
        }
    } catch (error) {
        throw Error(`Error updating password: ${error}`);
    }
};
