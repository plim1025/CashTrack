// REACT //
import React, { Suspense, useState, useEffect, createContext } from 'react';

// ROUTER //
import { withRouter, RouteComponentProps } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadEmail } from './redux/Actions';

// COMPONENTS //
import Header from './components/shared/Header';
import createResources from './components/shared/Resources';
import FallbackSpinner from './components/shared/FallbackSpinner';

// TYPES //
import { RootState, Transaction, Account, Category } from './types';

// VIEWS //
const Home = React.lazy(() => import(/* webpackChunkName: 'Home' */ './view/Home'));
const Transactions = React.lazy(
    () => import(/* webpackChunkName: 'Transactions' */ './view/Transactions')
);
const Trends = React.lazy(() => import(/* webpackChunkName: 'Trends' */ './view/Trends'));
const Accounts = React.lazy(() => import(/* webpackChunkName: 'Accounts' */ './view/Accounts'));
const Budgets = React.lazy(() => import(/* webpackChunkName: 'Budgets' */ './view/Budgets'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'Settings' */ './view/Settings'));

interface ResourcesContextType {
    transactions: { read: () => Transaction[] };
    accounts: { read: () => Account[] };
    categories: { read: () => Category[] };
    refresh: (message?: string) => void;
    subpage: string;
    setSubpage: (subpage: string) => void;
    logout: () => void;
}

export const ResourcesContext = createContext<ResourcesContextType>({
    transactions: null,
    accounts: null,
    categories: null,
    refresh: null,
    subpage: null,
    setSubpage: null,
    logout: null,
});

interface Props {
    subpage: string;
}

const App: React.FC<Props & RouteComponentProps> = props => {
    const dispatch = useDispatch();
    const [resources, setResources] = useState(null);
    const [subpage, setSubpage] = useState(props.subpage);
    const [refreshMessage, setRefreshMessage] = useState('');
    const globalEmail = useSelector((redux: RootState) => redux.email);

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw Error('Bad response from server');
            }
        } catch (error) {
            throw Error(`Error logging out: ${error}`);
        }
        if (globalEmail) {
            dispatch(loadEmail(''));
        }
        if (sessionStorage.getItem('email')) {
            sessionStorage.setItem('email', '');
        }
        setSubpage('home');
        props.history.push('/signin');
    };

    useEffect(() => {
        if (!globalEmail && !sessionStorage.getItem('email')) {
            props.history.push('/signin');
        } else {
            setResources(() => createResources());
            setSubpage(props.subpage);
        }
    }, []);

    return (
        <ResourcesContext.Provider
            value={{
                transactions: resources?.transactions,
                accounts: resources?.accounts,
                categories: resources?.categories,
                refresh: (message?: string) => {
                    setResources(() => createResources());
                    if (message) {
                        setRefreshMessage(message);
                    } else {
                        setRefreshMessage(null);
                    }
                },
                subpage: subpage,
                setSubpage: (newSubpage: string) => setSubpage(newSubpage),
                logout: () => {
                    throw logout();
                },
            }}
        >
            <Header />
            <Suspense fallback={<FallbackSpinner show message={refreshMessage} />}>
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
                ) : subpage === 'settings' ? (
                    <Settings />
                ) : (
                    <div>404</div>
                )}
            </Suspense>
        </ResourcesContext.Provider>
    );
};

export default withRouter(App);
