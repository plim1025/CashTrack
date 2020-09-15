// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';
import ViewModal from './ViewModal';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

// TYPES //
import { Charts, Data } from '../../types';

interface Props {
    chart: Charts;
    data: Data[];
}

const Chart: React.FC<Props> = props => {
    return (
        <Wrapper>
            {props.chart === 'bar' ? (
                <ResponsiveBar
                    data={props.data}
                    layout='horizontal'
                    margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
                />
            ) : null}
            {props.chart === 'pie' ? (
                <ResponsivePie
                    data={props.data}
                    margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
                />
            ) : null}
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    height: 100%;
    overflow: hidden;
`;

export default Chart;
