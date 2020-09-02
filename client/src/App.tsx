/* eslint-disable prettier/prettier */

// REACT //
import React, { Suspense, useEffect } from 'react';

// REDUX //
import { useSelector, useDispatch} from 'react-redux';
import { loadSubpage } from './redux/Actions';
import { RootState } from './redux/Store';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Header from './components/shared/Header';

// VIEWS //
const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */ './view/Home'));
const Transactions = React.lazy(() => import(/* webpackChunkName: 'Transactions' */ './view/Transactions'));
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Profile = React.lazy(() => import(/* webpackChunkName: 'Profile' */ './view/Profile'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));

// STYLES //
const ss = StyleSheet.create({});

interface Props {
    subpage: string;
}

const App: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const subpage = useSelector((state: RootState) => state.subpage);

    useEffect(() => {
        dispatch(loadSubpage(props.subpage));
    }, []);

    return (
        <>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
            {subpage === 'home' ? (
                <Home />
            ) : subpage === 'transactions' ? (
                <Transactions />
            ) : subpage === 'trends' ? (
                <Trends />
            ) : subpage === 'budgets' ? (
                <Budgets />
            ) : subpage === 'accounts' ? (
                <Accounts />
            ) : subpage === 'profile' ?  (
                <Profile />
            ) : subpage === 'settings' ? (
                <Settings /> 
            ) : (
                <div>404</div>
            )}
            </Suspense>
        </>

    );
};

export default App;
