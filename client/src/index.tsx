// ROUTER //
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

// REDUX //
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './redux/Store';

// VIEWS //
const Login = React.lazy(() => import(/* webpackChunkName: `Login` */ './view/Login'));
const Register = React.lazy(() => import(/* webpackChunkName: `Register` */ './view/Register'));
const Home = React.lazy(() => import(/* webpackChunkName: `Home` */ './view/Home'));
const Accounts = React.lazy(() => import(/* webpackChunkName: `Accounts` */ './view/Accounts'));
const Transactions = React.lazy(
    () => import(/* webpackChunkName: `Transactions` */ './view/Transactions')
);
const Trends = React.lazy(() => import(/* webpackChunkName: `Trends` */ './view/Trends'));

const { store, persistor } = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Suspense fallback={<div>Loading...</div>}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/home' component={Home} />
                        <Route exact path='/accounts' component={Accounts} />
                        <Route exact path='/transactions' component={Transactions} />
                        <Route exact path='/trends' component={Trends} />
                        <Redirect exact path='/' to='/home' />
                        <Route path='/' render={() => <div>404</div>} />
                    </Switch>
                </BrowserRouter>
            </Suspense>
        </PersistGate>
    </Provider>,
    document.getElementById('app')
);
