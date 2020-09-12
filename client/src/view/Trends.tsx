/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable prettier/prettier */
// REACT //
import React, { useState, useEffect, useReducer } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import Chart from '../components/Trends/Chart';
import Filters from '../components/Trends/Filters';
import TrendInfo from '../components/Trends/TrendInfo';
import Sidebar from '../components/Trends/Sidebar';
import { parseSelectedTransactions, parseTransactionData } from '../components/shared/TrendUtil';

// TYPES //
import { Transaction, Account, Trends, Subtrends, Charts, Dates, Data } from '../types';

type Actions =
    | { type: 'SET_TREND'; trend: Trends }
    | { type: 'SET_SUBTREND'; subtrend: Subtrends }
    | { type: 'SET_CHART'; chart: Charts }
    | { type: 'SET_DATE'; date: Dates }
    | { type: 'SET_ACCOUNT_IDS'; accountIDs: string[] };

interface ReducerState {
    trend: Trends;
    subtrend: Subtrends;
    chart: Charts;
    date: Dates;
    accountIDs: string[];
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
        default:
            return state;
    }
};

interface Props {
    transactions: { read: () => Transaction[] };
    accounts: { read: () => Account[] };
}

const Trends: React.FC<Props> = props => {
    const [state, dispatch] = useReducer(reducer, {
        trend: 'expense',
        subtrend: 'category',
        chart: 'pie',
        date: 'all time',
        accountIDs: props.accounts.read().map(account => account.id),
    });
    const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        const newSelectedTransactions = parseSelectedTransactions(
            props.transactions.read(),
            state.trend,
            state.date,
            state.accountIDs
        );
        setSelectedTransactions(newSelectedTransactions);
    }, [state.trend, state.subtrend, state.date, state.accountIDs]);

    useEffect(() => {
        if (state.subtrend === 'date') {
            dispatch({ type: 'SET_CHART', chart: 'bar' });
        }
    }, [state.subtrend]);

    useEffect(() => {
        setData(parseTransactionData(selectedTransactions, state.subtrend, state.date));
    }, [selectedTransactions]);

    return (
        <div className={css(ss.wrapper)}>
            <Sidebar
                trend={state.trend}
                subTrend={state.subtrend}
                setTrend={(trend: Trends) => dispatch({ type: 'SET_TREND', trend: trend })}
                setSubTrend={(subtrend: Subtrends) =>
                    dispatch({ type: 'SET_SUBTREND', subtrend: subtrend })
                }
            />
            <div className={css(ss.subWrapper)}>
                <h3 className={css(ss.title)}>{state.trend}</h3>
                <div className={css(ss.subtitle)}>By {state.subtrend}</div>
                <Filters
                    trend={state.trend}
                    accounts={state.accountIDs}
                    date={state.date}
                    setAccounts={(accountIDs: string[]) =>
                        dispatch({ type: 'SET_ACCOUNT_IDS', accountIDs: accountIDs })
                    }
                    setDate={(date: Dates) => dispatch({ type: 'SET_DATE', date: date })}
                />
                <Chart chart={state.chart} data={data} />
                <TrendInfo transactions={selectedTransactions} />
            </div>
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        height: 'calc(100% - 75px)',
    },
    subWrapper: {
        maxWidth: 800,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textTransform: 'capitalize',
    },
    subtitle: {
        textTransform: 'capitalize',
    },
});

export default Trends;
