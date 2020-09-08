// REACT //
import React, { Suspense, useState, useEffect } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadSubpage } from './redux/Actions';

// COMPONENTS //
import Header from './components/shared/Header';
import createResources from './components/shared/Resources';

// TYPES //
import { RootState } from './types';

// VIEWS //
const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */ './view/Home'));
const Transactions = React.lazy(
    () => import(/* webpackChunkName: 'Transactions' */ './view/Transactions')
);
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));

interface Props {
    subpage: string;
}

const App: React.FC<Props & RouteComponentProps> = props => {
    const [resources, setResources] = useState(() => createResources());
    const dispatch = useDispatch();
    const globalEmail = useSelector((redux: RootState) => redux.email);
    const globalSubpage = useSelector((redux: RootState) => redux.subpage);

    useEffect(() => {
        if (!globalEmail && !sessionStorage.getItem('email')) {
            props.history.push('/signin');
        } else {
            dispatch(loadSubpage(props.subpage));
        }
    }, []);

    return (
        <>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                {globalSubpage === 'home' ? (
                    <Home />
                ) : globalSubpage === 'transactions' ? (
                    <Transactions
                        resources={resources}
                        refreshResources={() => setResources(() => createResources())}
                    />
                ) : globalSubpage === 'trends' ? (
                    <Trends />
                ) : globalSubpage === 'budgets' ? (
                    <Budgets />
                ) : globalSubpage === 'accounts' ? (
                    <Accounts refreshResources={() => setResources(() => createResources())} />
                ) : globalSubpage === 'settings' ? (
                    <Settings />
                ) : (
                    <div>404</div>
                )}
            </Suspense>
        </>
    );
};

export default withRouter(App);
