// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';

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
        <Wrapper>
            <Header>Expenses</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('date');
                }}
                trend='expense'
                subTrend='date'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Time
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('category');
                }}
                trend='expense'
                subTrend='category'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Category
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('expense');
                    props.setSubTrend('merchant');
                }}
                trend='expense'
                subTrend='merchant'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Merchant
            </Subheader>
            <Header>Income</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('date');
                }}
                trend='income'
                subTrend='date'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Time
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('category');
                }}
                trend='income'
                subTrend='category'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Category
            </Subheader>
            <Subheader
                onClick={() => {
                    props.setTrend('income');
                    props.setSubTrend('merchant');
                }}
                trend='income'
                subTrend='merchant'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Merchant
            </Subheader>
            <Header>Net Earnings</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('net earnings');
                    props.setSubTrend('date');
                }}
                trend='net earnings'
                subTrend='date'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Time
            </Subheader>
            <Header>Net Worth</Header>
            <Subheader
                onClick={() => {
                    props.setTrend('net worth');
                    props.setSubTrend('date');
                }}
                trend='net worth'
                subTrend='date'
                curTrend={props.trend}
                curSubTrend={props.subTrend}
            >
                Time
            </Subheader>
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.nav`
    background: #f0f0f0;
    margin-top: 20px;
    width: 200px;
`;

const Header = styled.div`
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    font-size: 16px;
    font-weight: 700;
    padding: 10px;
    padding-bottom: 5px;
`;

const Subheader = styled.div<{
    trend: string;
    subTrend: string;
    curTrend: string;
    curSubTrend: string;
}>`
    background: ${({ trend, subTrend, curTrend, curSubTrend }) =>
        trend === curTrend && subTrend === curSubTrend && '#007bff'};
    color: ${({ trend, subTrend, curTrend, curSubTrend }) =>
        trend === curTrend && subTrend === curSubTrend && '#fff'};
    cursor: pointer;
    & :hover {
        color: #007bff;
    }
    font-size: 14px;
    padding: 5px 30px;
`;

export default Sidebar;
