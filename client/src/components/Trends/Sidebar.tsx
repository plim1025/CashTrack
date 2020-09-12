// REACT //
import React from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';

// TYPES //
import { Trends, Subtrends } from '../../types';

interface Props {
    trend: Trends;
    subTrend: Subtrends;
    setTrend: (trend: Trends) => void;
    setSubTrend: (subtrend: Subtrends) => void;
}

const Sidebar: React.FC<Props> = props => {
    return (
        <nav className={css(ss.wrapper)}>
            <div className={css(ss.header)}>Expenses</div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('date');
                }}
                style={{
                    background:
                        props.trend === 'expense' && props.subTrend === 'date' ? '#007bff' : '',
                    color: props.trend === 'expense' && props.subTrend === 'date' ? '#fff' : '',
                }}
            >
                Time
            </div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('category');
                }}
                style={{
                    background:
                        props.trend === 'expense' && props.subTrend === 'category' ? '#007bff' : '',
                    color: props.trend === 'expense' && props.subTrend === 'category' ? '#fff' : '',
                }}
            >
                Category
            </div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('merchant');
                }}
                style={{
                    background:
                        props.trend === 'expense' && props.subTrend === 'merchant' ? '#007bff' : '',
                    color: props.trend === 'expense' && props.subTrend === 'merchant' ? '#fff' : '',
                }}
            >
                Merchant
            </div>
            <div className={css(ss.header)}>Income</div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('date');
                }}
                style={{
                    background:
                        props.trend === 'income' && props.subTrend === 'date' ? '#007bff' : '',
                    color: props.trend === 'income' && props.subTrend === 'date' ? '#fff' : '',
                }}
            >
                Time
            </div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('category');
                }}
                style={{
                    background:
                        props.trend === 'income' && props.subTrend === 'category' ? '#007bff' : '',
                    color: props.trend === 'income' && props.subTrend === 'category' ? '#fff' : '',
                }}
            >
                Category
            </div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('merchant');
                }}
                style={{
                    background:
                        props.trend === 'income' && props.subTrend === 'merchant' ? '#007bff' : '',
                    color: props.trend === 'income' && props.subTrend === 'merchant' ? '#fff' : '',
                }}
            >
                Merchant
            </div>
            <div className={css(ss.header)}>Net Earnings</div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('net earnings');
                    props.setSubTrend('date');
                }}
                style={{
                    background:
                        props.trend === 'net earnings' && props.subTrend === 'date'
                            ? '#007bff'
                            : '',
                    color:
                        props.trend === 'net earnings' && props.subTrend === 'date' ? '#fff' : '',
                }}
            >
                Time
            </div>
            <div className={css(ss.header)}>Net Worth</div>
            <div
                className={css(ss.subHeader)}
                onClick={() => {
                    props.setTrend('net worth');
                    props.setSubTrend('date');
                }}
                style={{
                    background:
                        props.trend === 'net worth' && props.subTrend === 'date' ? '#007bff' : '',
                    color: props.trend === 'net worth' && props.subTrend === 'date' ? '#fff' : '',
                }}
            >
                Time
            </div>
        </nav>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        marginTop: 100,
        background: '#f0f0f0',
        width: 200,
    },
    header: {
        borderTop: '1px solid #dee2e6',
        borderOpacity: 0.5,
        padding: 10,
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: 700,
    },
    subHeader: {
        fontSize: 16,
        padding: '5px 30px',
        cursor: 'pointer',
        ':hover': {
            color: '#007bff',
        },
    },
});

export default Sidebar;
