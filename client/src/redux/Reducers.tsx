import { LOAD_EMAIL } from './Constants';
import { combineReducers } from 'redux';

const email = (state = '', action: { type: string; email?: string }): string => {
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
