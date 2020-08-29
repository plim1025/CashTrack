import { combineReducers } from 'redux';
import { LOAD_EMAIL } from './Constants';

const email = (state = null, action: { type: string; email?: string }) => {
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
