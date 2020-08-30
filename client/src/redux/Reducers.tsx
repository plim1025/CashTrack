import { LOAD_EMAIL } from './Constants';
import { combineReducers } from 'redux';

export const email = (state = '', action: { type: string; email?: string }): any => {
    switch (action.type) {
        case LOAD_EMAIL:
            return action.email;
        default:
            return state;
    }
};

export default combineReducers({
    email,
});
