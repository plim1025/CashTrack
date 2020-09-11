// REACT //
import React from 'react';
import Select from 'react-select';

// TYPES //
import { Trends, Dates } from '../../types';

interface Props {
    trend: Trends;
    accounts: string[];
    date: Dates;
    setAccounts: (accountIDs: string[]) => void;
    setDate: (date: Dates) => void;
}

const Filters: React.FC<Props> = props => {
    // if trend is net earnings or net worth, don't show accounts filter
    return (
        <>
            <Select
                options={[
                    { value: 'all time', label: 'All Time' },
                    { value: 'year', label: 'Past Year' },
                    { value: 'month', label: 'Past Month' },
                    { value: 'week', label: 'Past Week' },
                ]}
                onChange={(options: any) => props.setDate(options.value)}
                defaultValue={{ value: 'all time', label: 'All Time' }}
            />
            {props.trend !== 'net earnings' && props.trend !== 'net worth' ? <Select /> : null}
        </>
    );
};

export default Filters;
