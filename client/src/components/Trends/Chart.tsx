/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

// TYPES //
import { Charts, Transaction, Trends, Subtrends } from '../../types';

// UTILS //
import { moneyFormat } from '../shared/TransactionUtil';

interface Props {
    chart: Charts;
    trend: Trends;
    subtrend: Subtrends;
    data: any;
    openViewModal: (title: string, transactions: Transaction[]) => void;
}

const Chart: React.FC<Props> = props => {
    const barChartBottomAxis = {
        format: (value: any) => (props.subtrend === 'date' ? value : moneyFormat(value)),
        tickValues: 5,
        ...(props.subtrend === 'date' && {
            renderTick: (tickInfo: any) => (
                <g transform={`translate(${tickInfo.x},${tickInfo.y})`}>
                    <line
                        x1='0'
                        y1='0'
                        x2={tickInfo.lineX}
                        y2={tickInfo.lineY}
                        style={{ stroke: 'rgb(119, 119, 119)', strokeWidth: 1 }}
                    />
                    <text
                        dominantBaseline={tickInfo.textBaseline}
                        textAnchor='end'
                        style={{ fontSize: 11, fill: 'rgb(51, 51, 51)' }}
                        transform={`translate(-8,${tickInfo.textY}) rotate(270)`}
                    >
                        {tickInfo.value}
                    </text>
                </g>
            ),
        }),
    };

    const barChartLeftAxis = {
        format: (value: any) =>
            props.subtrend === 'date'
                ? moneyFormat(value)
                : value.toString().length > 13
                ? `${value.toString().substring(0, 10)}...`
                : value.toString(),
    };

    return (
        <>
            {props.data.length ? (
                <Wrapper trend={props.trend}>
                    {props.chart === 'bar' ? (
                        <ResponsiveBar
                            data={props.data}
                            keys={
                                props.trend === 'net earnings' ? ['income', 'expenses'] : ['value']
                            }
                            layout={props.subtrend === 'date' ? 'vertical' : 'horizontal'}
                            colors={
                                props.trend === 'net earnings'
                                    ? ['#007bff', '#dc3545']
                                    : ['#007bff']
                            }
                            markers={[{ axis: props.subtrend === 'date' ? 'y' : 'x', value: 0 }]}
                            enableLabel={false}
                            margin={{ top: 50, right: 100, bottom: 100, left: 100 }}
                            axisBottom={barChartBottomAxis}
                            axisLeft={barChartLeftAxis}
                            tooltip={(tooltip: any) => {
                                if (props.trend === 'net earnings') {
                                    return (
                                        <span>
                                            {tooltip.id.charAt(0).toUpperCase()}
                                            {tooltip.id.slice(1)} - {tooltip.indexValue} :{' '}
                                            <strong>{moneyFormat(tooltip.value)}</strong>
                                        </span>
                                    );
                                }
                                return (
                                    <span>
                                        {tooltip.data.id}:{' '}
                                        <strong>{moneyFormat(tooltip.value)}</strong>
                                    </span>
                                );
                            }}
                            onClick={({ data }: any) => {
                                if (props.trend !== 'net worth') {
                                    props.openViewModal(data.id.toString(), data.transactions);
                                }
                            }}
                        />
                    ) : null}
                    {props.chart === 'pie' ? (
                        <ResponsivePie
                            data={props.data}
                            margin={{ top: 50, right: 100, bottom: 100, left: 100 }}
                            colors={['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']}
                            enableSlicesLabels={false}
                            tooltipFormat={tooltip => moneyFormat(tooltip)}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            borderWidth={1}
                            radialLabelsLinkHorizontalLength={24}
                            radialLabelsSkipAngle={4}
                            onClick={({ id, transactions }: any) => {
                                if (props.trend !== 'net worth') {
                                    props.openViewModal(id.toString(), transactions);
                                }
                            }}
                        />
                    ) : null}
                </Wrapper>
            ) : (
                <NoTransactionsText>No transactions detected.</NoTransactionsText>
            )}
        </>
    );
};

// STYLES //
const Wrapper = styled(({ trend, ...rest }) => <div {...rest} />)<{ trend: Trends }>`
    height: 100%;
    overflow: hidden;
    & text {
        font-family: 'Open Sans' !important;
    }
    & path,
    & rect {
        cursor: ${({ trend }) => (trend !== 'net worth' ? 'pointer' : 'auto')};
    }
    & svg > rect {
        cursor: auto;
    }
`;

const NoTransactionsText = styled.div`
    align-self: center;
    margin-top: 50px;
    opacity: 0.75;
`;

export default Chart;
