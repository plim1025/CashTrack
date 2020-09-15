// REACT //
import React, { useRef } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Select, { components } from 'react-select';

// TYPES //
import { Trends, Dates, Account } from '../../types';

interface Props {
    trend: Trends;
    accounts: Account[];
    date: Dates;
    setAccounts: (accountIDs: string[]) => void;
    setDate: (date: Dates) => void;
    selectedAccountIDs: string[];
}

const Option = (props: any) => {
    return (
        <components.Option {...props}>
            <div style={{ fontWeight: 700 }}>{props.data.sublabel}</div>
            <div style={{ fontSize: 12 }}>{props.data.label}</div>
        </components.Option>
    );
};

const Filters: React.FC<Props> = props => {
    const selectedAccountIDsRef = useRef<string[]>(props.selectedAccountIDs);
    selectedAccountIDsRef.current = props.selectedAccountIDs;

    const accountOptions = props.accounts.map(account => ({
        value: account.id,
        label: account.name,
        sublabel: account.institution,
    }));

    const allAccountsOption = {
        value: 'All Accounts',
        label: 'All Accounts',
        sublabel: `${props.accounts.length} accounts`,
    };

    const isSelectAllSelected = () =>
        selectedAccountIDsRef.current.length === props.accounts.length;

    const handleAccountSelect = (selectedAccounts: any, info: any) => {
        const { action, option, removedValue } = info;
        if (action === 'select-option' && option.value === allAccountsOption.value) {
            props.setAccounts(props.accounts.map(account => account.id));
        } else if (
            (action === 'deselect-option' && option.value === allAccountsOption.value) ||
            (action === 'remove-value' && removedValue.value === allAccountsOption.value)
        ) {
            props.setAccounts([]);
        } else if (action === 'deselect-option' && isSelectAllSelected()) {
            props.setAccounts(
                props.accounts
                    .filter(account => account.id !== option.value)
                    .map(account => account.id)
            );
        } else {
            props.setAccounts(selectedAccounts.map((account: any) => account.value) || []);
        }
    };

    return (
        <Wrapper>
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
                    className='react-select'
                    classNamePrefix='react-select'
                    options={[allAccountsOption, ...accountOptions]}
                    isOptionSelected={(option: any) =>
                        selectedAccountIDsRef.current.some(value => value === option.value) ||
                        isSelectAllSelected()
                    }
                    controlShouldRenderValue={false}
                    value={
                        isSelectAllSelected()
                            ? [allAccountsOption]
                            : accountOptions.filter(
                                  account => props.selectedAccountIDs.indexOf(account.value) !== -1
                              )
                    }
                    placeholder='Select Accounts...'
                    isMulti
                    components={{ Option }}
                    onChange={handleAccountSelect}
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    blurInputOnSelect={false}
                />
            ) : null}
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export default Filters;
