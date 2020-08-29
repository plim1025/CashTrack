import { createStore, applyMiddleware, Store } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './Reducers';

const Store = (initialState: any): any => {
    return createStore(rootReducer, initialState, applyMiddleware(reduxThunk));
};

export default Store;
