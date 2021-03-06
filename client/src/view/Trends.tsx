// REACT //
import React, { useEffect, useReducer, useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Chart from '../components/Trends/Chart';
import Filters from '../components/Trends/Filters';
import Sidebar from '../components/Trends/Sidebar';
import FallbackSpinner from '../components/shared/FallbackSpinner';
import ViewModal from '../components/shared/ViewModal';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Account, Trends, Subtrends, Charts, Dates, Data } from '../types';

// UTIL //
import { parseSelectedTransactions, parseTransactionData } from '../components/Trends/TrendUtil';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_TREND'; trend: Trends }
    | { type: 'SET_SUBTREND'; subtrend: Subtrends }
    | { type: 'SET_CHART'; chart: Charts }
    | { type: 'SET_DATE'; date: Dates }
    | { type: 'SET_ACCOUNT_IDS'; accountIDs: string[] }
    | { type: 'SET_SELECTED_TRANSACTIONS'; selectedTransactions: Transaction[] }
    | { type: 'SET_DATA'; data: Data[] }
    | { type: 'SHOW_VIEW_MODAL'; title: string; transactions: Transaction[] }
    | { type: 'HIDE_VIEW_MODAL' };

interface ReducerState {
    loading: boolean;
    trend: Trends;
    subtrend: Subtrends;
    chart: Charts;
    date: Dates;
    accountIDs: string[];
    selectedTransactions: Transaction[];
    data: Data[];
    viewModal: {
        show: boolean;
        title: string;
        transactions: Transaction[];
    };
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_TREND':
            return { ...state, trend: action.trend };
        case 'SET_SUBTREND':
            return { ...state, subtrend: action.subtrend };
        case 'SET_CHART':
            return { ...state, chart: action.chart };
        case 'SET_DATE':
            return { ...state, date: action.date };
        case 'SET_ACCOUNT_IDS':
            return { ...state, accountIDs: action.accountIDs };
        case 'SET_SELECTED_TRANSACTIONS':
            return { ...state, selectedTransactions: action.selectedTransactions };
        case 'SET_DATA':
            return { ...state, data: action.data };
        case 'SHOW_VIEW_MODAL':
            return {
                ...state,
                viewModal: { show: true, title: action.title, transactions: action.transactions },
            };
        case 'HIDE_VIEW_MODAL':
            return { ...state, viewModal: { show: false, title: '', transactions: [] } };
        default:
            return state;
    }
};

const Trends: React.FC = () => {
    const { transactions, accounts, categories } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        trend: 'expenses',
        subtrend: 'date',
        chart: 'bar',
        date: 'month',
        accountIDs: [],
        selectedTransactions: [],
        data: [],
        viewModal: {
            show: false,
            title: '',
            transactions: [],
        },
    });

    useEffect(() => {
        const fetchedAccountIDs = accounts.map((account: Account) => account.id);
        dispatch({ type: 'SET_ACCOUNT_IDS', accountIDs: fetchedAccountIDs });
    }, []);

    useEffect(() => {
        const newSelectedTransactions = parseSelectedTransactions(
            transactions,
            categories,
            state.trend,
            state.date,
            state.accountIDs
        );
        dispatch({
            type: 'SET_SELECTED_TRANSACTIONS',
            selectedTransactions: newSelectedTransactions,
        });
    }, [state.trend, state.subtrend, state.date, state.accountIDs]);

    useEffect(() => {
        if (state.subtrend === 'date') {
            dispatch({ type: 'SET_CHART', chart: 'bar' });
        }
    }, [state.subtrend]);

    useEffect(() => {
        const newData = parseTransactionData(
            state.selectedTransactions,
            accounts,
            state.trend,
            state.subtrend,
            state.date
        );
        dispatch({ type: 'SET_DATA', data: newData });
    }, [state.selectedTransactions]);

    return (
        <Wrapper>
            <Sidebar
                trend={state.trend}
                subtrend={state.subtrend}
                setTrend={(trend: Trends) => dispatch({ type: 'SET_TREND', trend: trend })}
                setSubtrend={(subtrend: Subtrends) =>
                    dispatch({ type: 'SET_SUBTREND', subtrend: subtrend })
                }
            />
            <Subwrapper>
                <Filters
                    trend={state.trend}
                    subtrend={state.subtrend}
                    chart={state.chart}
                    accounts={accounts}
                    date={state.date}
                    setAccounts={(accountIDs: string[]) =>
                        dispatch({ type: 'SET_ACCOUNT_IDS', accountIDs: accountIDs })
                    }
                    setChart={(chart: Charts) => dispatch({ type: 'SET_CHART', chart: chart })}
                    setDate={(date: Dates) => dispatch({ type: 'SET_DATE', date: date })}
                    selectedAccountIDs={state.accountIDs}
                />
                <Chart
                    data={state.data}
                    chart={state.chart}
                    trend={state.trend}
                    subtrend={state.subtrend}
                    openViewModal={(title: string, newTransactions: Transaction[]) =>
                        dispatch({
                            type: 'SHOW_VIEW_MODAL',
                            title: title,
                            transactions: newTransactions,
                        })
                    }
                />
            </Subwrapper>
            <ViewModal
                show={state.viewModal.show}
                title={state.viewModal.title}
                transactions={state.viewModal.transactions}
                close={() => dispatch({ type: 'HIDE_VIEW_MODAL' })}
            />
            <FallbackSpinner backdrop show={state.loading} />
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    display: flex;
    height: calc(100% - 75px);
    justify-content: center;
    width: 100%;
`;

const Subwrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    width: 800px;
`;

export default Trends;
