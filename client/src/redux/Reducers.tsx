import { LOAD_EMAIL, LOAD_SUBPAGE } from './Constants';
import { combineReducers } from 'redux';

const email = (state = '', action: { type: string; email?: string }): any => {
    switch (action.type) {
        case LOAD_EMAIL:
            return action.email;
        default:
            return state;
    }
};

const subpage = (state = 'home', action: { type: string; subpage?: string }): any => {
    switch (action.type) {
        case LOAD_SUBPAGE:
            return action.subpage;
        default:
            return state;
    }
};

export default combineReducers({
    email,
    subpage,
});
