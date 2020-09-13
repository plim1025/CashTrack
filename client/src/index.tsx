// REACT //
import ReactDOM from 'react-dom';

// ROUTER //
import { BrowserRouter, Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';

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
import Landing from './view/Landing';
import App from './App';

const { store, persistor } = configureStore();

interface TRouteParams {
    subpage: string;
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/landing' component={Landing} />
                    <Route exact path='/signin' component={Signin} />
                    <Route exact path='/register' component={Register} />
                    <Redirect exact from='/' to='/home' />
                    <Route
                        path='/:subpage'
                        component={({ match }: RouteComponentProps<TRouteParams>) => (
                            <App subpage={match.params.subpage} />
                        )}
                    />
                </Switch>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('app')
);
