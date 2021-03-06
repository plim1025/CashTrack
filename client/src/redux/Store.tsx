import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/es/storage';
import reduxThunk from 'redux-thunk';
import rootReducer from './Reducers';

const localPersistConfig = {
    key: 'CashTrack',
    storage: localStorage,
    whitelist: ['email'],
    blacklist: ['transactions'],
};

const persistedReducer = persistReducer(localPersistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(reduxThunk));
const persistor = persistStore(store);

export default (): any => {
    return { persistor, store };
};
