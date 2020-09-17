/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

// TYPES //
import { Charts, Data } from '../../types';

// UTILS //
import { moneyFormat } from '../shared/TransactionUtil';

interface Props {
    chart: Charts;
    data: Data[];
    openViewModal: (show: boolean) => void;
}

const Chart: React.FC<Props> = props => {
    const [mouseOver, setMouseOver] = useState(false);

    return (
        <>
            {props.data.length ? (
                <Wrapper mouseOver={mouseOver}>
                    {props.chart === 'bar' ? (
                        <ResponsiveBar
                            data={props.data}
                            layout='horizontal'
                            colors={['#007bff']}
                            markers={[{ axis: 'x', value: 0 }]}
                            enableLabel={false}
                            margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
                            axisBottom={{ format: value => moneyFormat(value), tickValues: 5 }}
                            axisLeft={{
                                format: value =>
                                    value.toString().length > 13
                                        ? `${value.toString().substring(0, 10)}...`
                                        : value.toString(),
                            }}
                            tooltip={tooltip => (
                                <span>
                                    {tooltip.data.id}: <strong>{moneyFormat(tooltip.value)}</strong>
                                </span>
                            )}
                            onClick={() => props.openViewModal(true)}
                            onMouseEnter={() => setMouseOver(true)}
                            onMouseLeave={() => setMouseOver(false)}
                        />
                    ) : null}
                    {props.chart === 'pie' ? (
                        <ResponsivePie
                            data={props.data}
                            margin={{ top: 25, right: 75, bottom: 75, left: 75 }}
                            colors={['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']}
                            enableSlicesLabels={false}
                            tooltipFormat={tooltip => moneyFormat(tooltip)}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            borderWidth={1}
                            radialLabelsLinkHorizontalLength={24}
                            radialLabelsSkipAngle={4}
                            onClick={() => props.openViewModal(true)}
                            onMouseEnter={() => setMouseOver(true)}
                            onMouseLeave={() => setMouseOver(false)}
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
const Wrapper = styled(({ mouseOver, ...rest }) => <div {...rest} />)<{ mouseOver: boolean }>`
    height: 100%;
    overflow: hidden;
    & text {
        font-family: 'Open Sans' !important;
    }
    & path,
    & g {
        cursor: ${({ mouseOver }) => (mouseOver ? 'pointer' : 'auto')};
    }
`;

const NoTransactionsText = styled.div`
    align-self: center;
    margin-top: 50px;
    opacity: 0.75;
`;

export default Chart;
