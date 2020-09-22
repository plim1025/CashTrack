// REACT //
import React, { useRef } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { components } from 'react-select';
import Dropdown from '../shared/Dropdown';

// TYPES //
import { Trends, Subtrends, Charts, Dates, Account, DropdownOption } from '../../types';

interface Props {
    trend: Trends;
    subtrend: Subtrends;
    chart: Charts;
    accounts: Account[];
    date: Dates;
    setAccounts: (accountIDs: string[]) => void;
    setChart: (chart: Charts) => void;
    setDate: (date: Dates) => void;
    selectedAccountIDs: string[];
}

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

    const handleAccountSelect = (selectedAccounts: DropdownOption[], info: any) => {
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
            <TitleWrapper>
                <Title>{props.trend}</Title>
                <Subtitle>
                    {'By '}
                    {props.subtrend}
                </Subtitle>
                <ChartSwap>
                    <ChartIconWrapper
                        onClick={() => props.setChart('bar')}
                        chart='bar'
                        curChart={props.chart}
                    >
                        <ChartIcon viewBox='0 0 512 512'>
                            <path d='M488.399,492h-21.933V173.536c0-14.823-12.06-26.882-26.882-26.882H390.56c-14.823,0-26.882,12.06-26.882,26.882V492 h-55.692V317.825c0-14.823-12.059-26.882-26.882-26.882H232.08c-14.823,0-26.882,12.06-26.882,26.882V492h-55.692v-90.204 c0-14.823-12.06-26.882-26.882-26.882H73.599c-14.823,0-26.882,12.06-26.882,26.882V492H23.601c-5.523,0-10,4.477-10,10 s4.477,10,10,10h464.798c5.523,0,10-4.477,10-10S493.922,492,488.399,492z M129.504,492H66.716v-90.204 c0-3.795,3.087-6.882,6.882-6.882h49.024c3.795,0,6.882,3.087,6.882,6.882V492z M287.985,492h-62.788V317.825 c0-3.795,3.087-6.882,6.882-6.882h49.024c3.794,0,6.882,3.087,6.882,6.882V492z M446.466,492h-62.788V173.536 c0-3.795,3.087-6.882,6.882-6.882h49.024c3.795,0,6.882,3.087,6.882,6.882V492z' />
                            <path d='M466.442,10.516c0.14-2.729-0.82-5.504-2.904-7.588c-2.084-2.084-4.859-3.045-7.588-2.904 C455.789,0.017,455.63,0,455.466,0h-60.5c-5.523,0-10,4.477-10,10s4.477,10,10,10h37.357l-98.857,98.858l-37.28-37.28 c-1.875-1.875-4.419-2.929-7.071-2.929c-2.652,0-5.196,1.054-7.071,2.929l-179.769,179.77c-3.905,3.905-3.905,10.237,0,14.143 c1.953,1.951,4.512,2.927,7.071,2.927s5.119-0.976,7.071-2.929L289.115,102.79l37.28,37.28c3.905,3.905,10.237,3.905,14.143,0 L446.466,34.143v33.81c0,5.523,4.477,10,10,10s10-4.477,10-10V11C466.466,10.837,466.449,10.678,466.442,10.516z' />
                            <circle cx='75.64' cy='303.31' r='10' />
                        </ChartIcon>
                    </ChartIconWrapper>
                    {props.subtrend !== 'date' ? (
                        <ChartIconWrapper
                            onClick={() => props.setChart('pie')}
                            chart='pie'
                            curChart={props.chart}
                        >
                            <ChartIcon viewBox='0 0 512 512'>
                                <svg viewBox='0 0 512 512'>
                                    <path d='M437.02,74.981C388.667,26.628,324.38,0,256,0S123.333,26.628,74.98,74.981C26.629,123.333,0,187.62,0,256 s26.629,132.667,74.98,181.019C123.333,485.372,187.62,512,256,512s132.667-26.628,181.02-74.981 C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.981z M246,20.227V246H20.227 C25.348,123.808,123.809,25.347,246,20.227z M256,492C129.221,492,25.486,391.509,20.227,266h231.631l163.714,163.713 C373.529,468.364,317.476,492,256,492z M429.713,415.57L270.143,256l110.179-110.179c3.905-3.905,3.905-10.237,0-14.143 c-3.906-3.905-10.236-3.905-14.143,0L266,231.857V20.227C391.509,25.487,492,129.22,492,256 C492,317.475,468.364,373.528,429.713,415.57z' />
                                    <path d='M214.715,441.504c-38.233-8.469-72.487-28.327-99.058-57.426c-3.726-4.079-10.05-4.365-14.128-0.642 c-4.078,3.724-4.365,10.049-0.642,14.128c29.362,32.155,67.227,54.102,109.501,63.466c0.729,0.162,1.456,0.239,2.173,0.239 c4.586,0,8.721-3.176,9.754-7.839C223.51,448.038,220.106,442.699,214.715,441.504z' />
                                    <path d='M256.084,446c-0.028,0-0.056,0-0.084,0c-6.352,0-10.158,5.074-10.168,9.979c-0.011,4.906,3.774,9.996,10.125,10.022 c0.018,0,0.033,0,0.051,0c6.32,0,10.129-5.045,10.159-9.937C266.198,451.16,262.436,446.054,256.084,446z' />
                                    <path d='M411.819,100.18c-1.859-1.86-4.439-2.93-7.069-2.93s-5.21,1.07-7.07,2.93c-1.86,1.86-2.93,4.44-2.93,7.07 s1.069,5.21,2.93,7.07c1.861,1.86,4.44,2.93,7.07,2.93c2.64,0,5.21-1.07,7.069-2.93c1.86-1.86,2.931-4.44,2.931-7.07 S413.68,102.04,411.819,100.18z' />
                                </svg>
                            </ChartIcon>
                        </ChartIconWrapper>
                    ) : null}
                </ChartSwap>
            </TitleWrapper>
            <DropdownWrapper>
                <Dropdown
                    style={{ width: 200, margin: '0 10px', marginBottom: 6, minWidth: 200 }}
                    size='sm'
                    options={[
                        { value: 'all time', label: 'All Time' },
                        { value: 'year', label: 'Past Year' },
                        { value: 'month', label: 'Past Month' },
                        { value: 'week', label: 'Past Week' },
                    ]}
                    defaultOption={{ value: 'all time', label: 'All Time' }}
                    onChange={(options: any) => props.setDate(options.value)}
                />
                {props.trend !== 'net earnings' && props.trend !== 'net worth' ? (
                    <Dropdown
                        isMulti
                        style={{ width: 200, margin: '0 10px', minWidth: 200 }}
                        size='sm'
                        options={[allAccountsOption, ...accountOptions]}
                        isOptionSelected={(option: DropdownOption) =>
                            selectedAccountIDsRef.current.some(value => value === option.value) ||
                            isSelectAllSelected()
                        }
                        controlShouldRenderValue={false}
                        value={
                            isSelectAllSelected()
                                ? [allAccountsOption]
                                : accountOptions.filter(
                                      account =>
                                          props.selectedAccountIDs.indexOf(account.value) !== -1
                                  )
                        }
                        placeholder='Select Accounts...'
                        onChange={handleAccountSelect}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={false}
                        blurInputOnSelect={false}
                        optionComponent={(optionProps: any) => (
                            <components.Option {...optionProps}>
                                <div style={{ fontWeight: 700 }}>{optionProps.data.sublabel}</div>
                                <div style={{ fontSize: 12 }}>{optionProps.data.label}</div>
                            </components.Option>
                        )}
                    />
                ) : null}
            </DropdownWrapper>
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.div`
    align-items: center;
    display: flex;
    max-width: 800px;
    padding: calc(20px + 1.25rem);
    padding-bottom: 0;
`;

const DropdownWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding: 20px;
    width: 100%;
`;

const TitleWrapper = styled.div`
    align-self: flex-start;
`;

const Title = styled.h3`
    font-weight: 700;
    text-transform: capitalize;
`;

const Subtitle = styled.div`
    text-transform: capitalize;
`;

const ChartSwap = styled.div`
    display: flex;
    margin-top: 10px;
`;

const ChartIconWrapper = styled(({ chart, curChart, ...rest }) => <div {...rest} />)<{
    chart: Charts;
    curChart: Charts;
}>`
    align-items: center;
    background: ${({ chart, curChart }) => chart === curChart && '#007bff'};
    border-radius: 4px;
    & svg {
        fill: ${({ chart, curChart }) => (chart === curChart ? '#fff' : '#000')};
    }
    cursor: pointer;
    display: flex;
    height: 32px;
    justify-content: center;
    margin: 0 5px;
    width: 32px;
    &:hover {
        background: ${({ chart, curChart }) => chart !== curChart && 'rgba(0, 123, 255, 0.25)'};
    }
`;

const ChartIcon = styled.svg`
    height: 32px;
    padding: 4px;
    width: 32px;
`;

export default Filters;
