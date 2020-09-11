// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
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
        <div className={css(ss.wrapper)}>
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
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        height: '100%',
        overflow: 'hidden',
    },
});

export default Chart;
