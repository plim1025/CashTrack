// REACT //
import React, { useEffect, useReducer, useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Chart from '../components/Trends/Chart';
import Filters from '../components/Trends/Filters';
import TrendInfo from '../components/Trends/TrendInfo';
import Sidebar from '../components/Trends/Sidebar';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Account, Trends, Subtrends, Charts, Dates, Data } from '../types';

// UTIL //
import { parseSelectedTransactions, parseTransactionData } from '../components/shared/TrendUtil';

type Actions =
    | { type: 'SET_TREND'; trend: Trends }
    | { type: 'SET_SUBTREND'; subtrend: Subtrends }
    | { type: 'SET_CHART'; chart: Charts }
    | { type: 'SET_DATE'; date: Dates }
    | { type: 'SET_ACCOUNT_IDS'; accountIDs: string[] }
    | { type: 'SET_SELECTED_TRANSACTIONS'; selectedTransactions: Transaction[] }
    | { type: 'SET_DATA'; data: Data[] };

interface ReducerState {
    trend: Trends;
    subtrend: Subtrends;
    chart: Charts;
    date: Dates;
    accountIDs: string[];
    selectedTransactions: Transaction[];
    data: Data[];
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
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
        default:
            return state;
    }
};

const Trends: React.FC = () => {
    const { transactions, accounts, categories } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        trend: 'expense',
        subtrend: 'category',
        chart: 'pie',
        date: 'all time',
        accountIDs: accounts.read().map((account: Account) => account.id),
        selectedTransactions: [],
        data: [],
    });

    useEffect(() => {
        const newSelectedTransactions = parseSelectedTransactions(
            transactions.read(),
            categories.read(),
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
            state.subtrend,
            state.date
        );
        dispatch({ type: 'SET_DATA', data: newData });
    }, [state.selectedTransactions]);

    console.log(state.data);
    return (
        <Wrapper>
            <Sidebar
                trend={state.trend}
                subTrend={state.subtrend}
                setTrend={(trend: Trends) => dispatch({ type: 'SET_TREND', trend: trend })}
                setSubTrend={(subtrend: Subtrends) =>
                    dispatch({ type: 'SET_SUBTREND', subtrend: subtrend })
                }
            />
            <SubWrapper>
                <TitleWrapper>
                    <Title>{state.trend}</Title>
                    <Subtitle>
                        {'By '}
                        {state.subtrend}
                    </Subtitle>
                </TitleWrapper>
                <Filters
                    trend={state.trend}
                    accounts={accounts.read()}
                    date={state.date}
                    setAccounts={(accountIDs: string[]) =>
                        dispatch({ type: 'SET_ACCOUNT_IDS', accountIDs: accountIDs })
                    }
                    setDate={(date: Dates) => dispatch({ type: 'SET_DATE', date: date })}
                    selectedAccountIDs={state.accountIDs}
                />
            </SubWrapper>
            <Chart chart={state.chart} data={state.data} />
            <TrendInfo transactions={state.selectedTransactions} />
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    display: flex;
    height: calc(100% - 75px);
    justify-content: center;
`;

const SubWrapper = styled.div`
    display: flex;
    height: 100%;
    max-width: 800px;
    padding: 20px;
    width: 100%;
`;

const TitleWrapper = styled.div``;

const Title = styled.h3`
    text-transform: capitalize;
`;

const Subtitle = styled.div`
    text-transform: capitalize;
`;

export default Trends;
