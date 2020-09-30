// REACT //
import React, { useState, useEffect, useRef } from 'react';

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
    const [minified, setMinified] = useState(window.innerWidth < 750);
    const [expanded, setExpanded] = useState(false);
    const prevWindowWidth = useRef(window.innerWidth);

    useEffect(() => {
        const resizeListener = () => {
            console.log('here');
            if (prevWindowWidth.current > 750 && window.innerWidth <= 750) {
                console.log('set mini');
                setMinified(true);
            } else if (prevWindowWidth.current <= 750 && window.innerWidth > 750) {
                console.log('off mini');
                setMinified(false);
                setExpanded(false);
            }
            prevWindowWidth.current = window.innerWidth;
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    return (
        <Wrapper
            style={{
                left: expanded ? 0 : -250,
                boxShadow: expanded ? '#6c757d 1px -1px 4px 1px' : null,
            }}
        >
            {minified ? (
                <Expander
                    onClick={() => setExpanded(prevExpanded => !prevExpanded)}
                    style={{
                        left: expanded ? 'calc(230px - 1.25rem)' : 250,
                        border: expanded ? 0 : '2px solid rgb(187, 187, 187)',
                        borderRadius: expanded ? 0 : '0 9px 9px 0',
                    }}
                >
                    <ChevronIcon
                        viewBox='0 0 256 256'
                        style={{
                            transform: expanded ? 'rotate(90deg)' : 'rotate(270deg)',
                        }}
                    >
                        <polygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' />
                    </ChevronIcon>
                </Expander>
            ) : null}
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
    height: 100%;
    margin-bottom: 20px;
    width: 250px;
    z-index: 1;
    @media (max-width: 750px) {
        position: fixed;
    }
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

const Expander = styled.div`
    align-items: center;
    background: #f0f0f0;
    display: flex;
    fill: rgb(64, 64, 64);
    height: calc(20px + 1.25rem);
    justify-content: center;
    position: relative;
    width: calc(20px + 1.25rem);
    &:hover {
        background: rgba(0, 123, 255, 0.25);
        cursor: pointer;
    }
`;

const ChevronIcon = styled.svg`
    height: 16px;
    width: 16px;
`;

export default Sidebar;
