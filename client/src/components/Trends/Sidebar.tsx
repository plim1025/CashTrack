// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';

// TYPES //
import { Trends, Subtrends } from '../../types';

interface Props {
    trend: Trends;
    subtrend: Subtrends;
    setTrend: (trend: Trends) => void;
    setSubtrend: (subtrend: Subtrends) => void;
}

const Sidebar: React.FC<Props> = props => {
    return (
        <Wrapper>
            <Header>Expenses</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('expenses');
                    props.setSubtrend('date');
                }}
                trend='expenses'
                subtrend='date'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Time
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('expenses');
                    props.setSubtrend('category');
                }}
                trend='expenses'
                subtrend='category'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Category
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('expenses');
                    props.setSubtrend('merchant');
                }}
                trend='expenses'
                subtrend='merchant'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Merchant
            </Subheader>
            <Header>Income</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubtrend('date');
                }}
                trend='income'
                subtrend='date'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Time
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubtrend('category');
                }}
                trend='income'
                subtrend='category'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Category
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubtrend('merchant');
                }}
                trend='income'
                subtrend='merchant'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Merchant
            </Subheader>
            <Header>Net Earnings</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('net earnings');
                    props.setSubtrend('date');
                }}
                trend='net earnings'
                subtrend='date'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Time
            </Subheader>
            <Header>Net Worth</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('net worth');
                    props.setSubtrend('date');
                }}
                trend='net worth'
                subtrend='date'
                curTrend={props.trend}
                curSubtrend={props.subtrend}
            >
                Time
            </Subheader>
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.nav`
    background: #f0f0f0;
    margin-bottom: 20px;
    margin-top: calc(20px + 1.25rem);
    min-width: 200px;
    width: 200px;
`;

const Header = styled.div`
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    font-size: 16px;
    font-weight: 700;
    padding: 10px;
    padding-bottom: 4px;
`;

const Subheader = styled(({ trend, subtrend, curTrend, curSubtrend, ...rest }) => (
    <div {...rest} />
))<{
    trend: string;
    subtrend: string;
    curTrend: string;
    curSubtrend: string;
}>`
    background: ${({ trend, subtrend, curTrend, curSubtrend }) =>
        trend === curTrend && subtrend === curSubtrend && '#007bff'};
    color: ${({ trend, subtrend, curTrend, curSubtrend }) =>
        trend === curTrend && subtrend === curSubtrend && '#fff'};
    cursor: pointer;
    &:hover {
        color: ${({ trend, subtrend, curTrend, curSubtrend }) =>
            (trend !== curTrend || subtrend !== curSubtrend) && '#007bff'};
    }
    font-size: 16px;
    padding: 4px 30px;
`;

export default Sidebar;
