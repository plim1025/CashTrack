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
import ForgotPassword from './view/ForgotPassword';
import ResetPassword from './view/ResetPassword';
import App from './App';

const { store, persistor } = configureStore();

interface SubpageRouteParams {
    subpage: string;
}

interface ResetPasswordRouteParams {
    userID: string;
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/landing' component={Landing} />
                    <Route exact path='/signin' component={Signin} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/forgotpassword' component={ForgotPassword} />
                    <Route
                        path='/resetpassword/:userID'
                        render={({ match }: RouteComponentProps<ResetPasswordRouteParams>) => (
                            <ResetPassword userID={match.params.userID} />
                        )}
                    />
                    <Redirect exact from='/' to='/transactions' />
                    <Route
                        path='/:subpage'
                        component={({ match }: RouteComponentProps<SubpageRouteParams>) => {
                            return <App subpage={match.params.subpage} />;
                        }}
                    />
                    <Route path='*' component={() => <div>404</div>} />
                </Switch>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('app')
);
