import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Store from './redux/Store';
import Login from './view/Login';
import Home from './view/Home';
import Accounts from './view/Accounts';
import Transactions from './view/Transactions';
import Trends from './view/Trends';

let initialState;
const store = Store(initialState);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/home' component={Home} />
                <Route exact path='/accounts' component={Accounts} />
                <Route exact path='/transactions' component={Transactions} />
                <Route exact path='/trends' component={Trends} />
                <Redirect exact path='/' to='/home' />
                <Route path='/' render={() => <div>404</div>} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
