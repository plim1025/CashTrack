// REACT //
import ReactDOM from 'react-dom';

// ROUTER //
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

// REDUX //
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './redux/Store';

// COMPONENTS //
import './assets/css/index.css';

// VIEWS //
import Signin from './view/Signin';
import Register from './view/Register';
import App from './App';

const { store, persistor } = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/signin' component={Signin} />
                    <Route exact path='/register' component={Register} />
                    <Redirect exact from='/' to='/home' />
                    <Route
                        path='/:subpage'
                        component={(route: any) => <App subpage={route.match.params.subpage} />}
                    />
                </Switch>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('app')
);
