// REACT //
import React from 'react';

// COMPONENTS //
import Select, { components } from 'react-select';

// TYPES //
import { Trends, Dates, Account } from '../../types';

interface Props {
    trend: Trends;
    accounts: Account[];
    date: Dates;
    setAccounts: (accountIDs: string[]) => void;
    setDate: (date: Dates) => void;
}

const Filters: React.FC<Props> = props => {
    return (
        <>
            <Select
                className='react-select'
                classNamePrefix='react-select'
                options={[
                    { value: 'all time', label: 'All Time' },
                    { value: 'year', label: 'Past Year' },
                    { value: 'month', label: 'Past Month' },
                    { value: 'week', label: 'Past Week' },
                ]}
                onChange={(options: any) => props.setDate(options.value)}
                defaultValue={{ value: 'all time', label: 'All Time' }}
            />
            {props.trend !== 'net earnings' && props.trend !== 'net worth' ? (
                <Select
                    options={[
                        { value: 'all time', label: 'All Time' },
                        { value: 'year', label: 'Past Year' },
                        { value: 'month', label: 'Past Month' },
                        { value: 'week', label: 'Past Week' },
                    ]}
                    isMulti
                    components={{ SingleValue: (componentProps: any) => <div>Hello world</div> }}
                />
            ) : null}
        </>
    );
};

export default Filters;
