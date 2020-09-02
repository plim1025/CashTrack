/* eslint-disable prettier/prettier */

// REACT //
import React, { Suspense, useEffect } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useSelector, useDispatch} from 'react-redux';
import { loadSubpage } from './redux/Actions';
import { RootState } from './redux/Store';

// COMPONENTS //
import Header from './components/shared/Header';

// VIEWS //
const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */ './view/Home'));
const Transactions = React.lazy(() => import(/* webpackChunkName: 'Transactions' */ './view/Transactions'));
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Profile = React.lazy(() => import(/* webpackChunkName: 'Profile' */ './view/Profile'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));

interface Props {
    history: any;
    subpage: string;
}

const App: React.FC<Props & RouteComponentProps> = props => {
    const dispatch = useDispatch();
    const stateEmail = useSelector((state: RootState) => state.email);
    const stateSubpage = useSelector((state: RootState) => state.subpage);

    useEffect(() => {
        if (!stateEmail && !sessionStorage.getItem('email')) {
            props.history.push('/signin');
        } else {
            dispatch(loadSubpage(props.subpage));
        }
    }, []);

    return (
        <>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                {stateSubpage === 'home' ? (
                    <Home />
                ) : stateSubpage === 'transactions' ? (
                    <Transactions />
                ) : stateSubpage === 'trends' ? (
                    <Trends />
                ) : stateSubpage === 'budgets' ? (
                    <Budgets />
                ) : stateSubpage === 'accounts' ? (
                    <Accounts />
                ) : stateSubpage === 'profile' ?  (
                    <Profile />
                ) : stateSubpage === 'settings' ? (
                    <Settings /> 
                ) : (
                    <div>404</div>
                )}
            </Suspense>
        </>

    );
};

export default withRouter(App);
