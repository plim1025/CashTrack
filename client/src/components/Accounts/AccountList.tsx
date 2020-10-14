/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React, { useState, useContext } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import Button from '../shared/Button';
import { Card, Form } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

// TYPES //
import { Account } from '../../types';

// UTILS //
import { parseDate, parseSubtype, updateAccount } from './AccountsUtils';
import { moneyFormat } from '../shared/SharedUtils';

interface Props {
    setLoading: (loading: boolean) => void;
    accounts: Account[];
    openAccountDeleteModal: (batchID: string) => void;
}

const AccountList: React.FC<Props> = props => {
    const { accounts, setAccounts, transactions, setTransactions } = useContext(ResourcesContext);
    const institutionAccounts = props.accounts.reduce((institutionAccount, account) => {
        // eslint-disable-next-line no-param-reassign
        institutionAccount[account.batchID] = institutionAccount[account.batchID] || [];
        institutionAccount[account.batchID].push(account);
        return institutionAccount;
    }, Object.create(null));
    const [expandedID, setExpandedID] = useState('');
    const [accountInfo, setAccountInfo] = useState({ name: '', hidden: false });

    const handleExpand = (account: Account) => {
        if (expandedID === account.id) {
            setExpandedID('');
        } else {
            setExpandedID(account.id);
        }
        setAccountInfo({ name: account.name, hidden: account.hidden });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLElement>, accountID: string) => {
        e.preventDefault();
        props.setLoading(true);
        const newAccount = await updateAccount(accountID, accountInfo);
        setAccounts(accounts.map(account => (account.id === accountID ? newAccount : account)));
        const hiddenAccountIDs = accounts
            .filter(account => account.hidden && account.id !== accountID)
            .map(account => account.id);
        if (accountInfo.hidden) {
            hiddenAccountIDs.push(accountID);
        }
        const parsedTransactions = transactions.filter(
            transaction => hiddenAccountIDs.indexOf(transaction.accountID) === -1
        );
        setTransactions(parsedTransactions);
        setExpandedID('');
        props.setLoading(false);
    };

    return (
        <>
            {Object.keys(institutionAccounts).map(batchID => (
                <CardWrapper key={batchID}>
                    <CardTitleWrapper>
                        <Institution>{institutionAccounts[batchID][0].institution}</Institution>
                        <LastUpdated>
                            Last Updated{' '}
                            {parseDate(
                                institutionAccounts[batchID]
                                    .map((account: Account) => account.lastUpdated)
                                    .reduce((a: Date, b: Date) => (a < b ? a : b))
                            )}
                        </LastUpdated>
                    </CardTitleWrapper>
                    <CardBodyWrapper>
                        {institutionAccounts[batchID].map((account: Account) => (
                            <React.Fragment key={account.id}>
                                <AccountWrapper onClick={() => handleExpand(account)}>
                                    <ChevronIcon
                                        viewBox='0 0 256 256'
                                        style={{
                                            transform:
                                                expandedID === account.id ? 'rotate(180deg)' : null,
                                        }}
                                    >
                                        <polygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' />
                                    </ChevronIcon>
                                    <AccountTextWrapper>
                                        <AccounTextSubWrapper>
                                            <AccountName>
                                                {account.name} (...{account.mask})
                                            </AccountName>
                                            <Money>
                                                {moneyFormat(
                                                    transactions
                                                        .filter(
                                                            transaction =>
                                                                transaction.accountID === account.id
                                                        )
                                                        .map(transaction => transaction.amount)
                                                        .length
                                                        ? transactions
                                                              .filter(
                                                                  transaction =>
                                                                      transaction.accountID ===
                                                                      account.id
                                                              )
                                                              .map(
                                                                  transaction => transaction.amount
                                                              )
                                                              .reduce(
                                                                  (total, amount) => total + amount
                                                              )
                                                        : 0
                                                )}
                                            </Money>
                                        </AccounTextSubWrapper>
                                        <AccountType subtype={account.subtype}>
                                            {parseSubtype(account.subtype)}
                                        </AccountType>
                                    </AccountTextWrapper>
                                </AccountWrapper>
                                {expandedID === account.id ? (
                                    <Form>
                                        <FormSubWrapper>
                                            <FormName>
                                                <FormNameLabel>Name</FormNameLabel>
                                                <FormNameControl
                                                    defaultValue={accountInfo.name}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        setAccountInfo({
                                                            ...accountInfo,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            </FormName>
                                            <FormSwitch
                                                checked={accountInfo.hidden}
                                                id='hidden-switch'
                                                type='switch'
                                                label='Hidden'
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setAccountInfo({
                                                        ...accountInfo,
                                                        hidden: e.target.checked,
                                                    })
                                                }
                                            />
                                        </FormSubWrapper>
                                        <Buttons>
                                            <Button
                                                child='Cancel'
                                                onClick={() => setExpandedID('')}
                                                size='sm'
                                                variant='secondary'
                                            />
                                            <Button
                                                child='Save'
                                                onClick={e => handleSubmit(e, account.id)}
                                                size='sm'
                                                variant='primary'
                                                submit
                                                style={{ marginLeft: 10 }}
                                            />
                                        </Buttons>
                                    </Form>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </CardBodyWrapper>
                    <Button
                        child='Sign Out'
                        variant='danger'
                        style={{ position: 'absolute', right: 20 }}
                        onClick={() => props.openAccountDeleteModal(batchID)}
                    />
                </CardWrapper>
            ))}
        </>
    );
};

// STYLES //
const CardWrapper = styled(Card)`
    margin: 0 auto;
    margin-bottom: 20px;
    max-width: 600px;
    padding: 20px;
    width: calc(100% - 40px);
`;

const CardTitleWrapper = styled.div``;

const Institution = styled.div`
    width: calc(100% - 160px);
    &&& {
        font-size: 1.25rem;
        font-weight: 700;
    }
`;

const LastUpdated = styled.div`
    &&& {
        font-size: 16px;
        opacity: 0.75;
    }
`;

const CardBodyWrapper = styled(Card.Body)`
    font-size: 16px;
    &&& {
        line-height: inherit;
        padding: 0px;
    }
`;

const AccountWrapper = styled(Card.Body)`
    align-items: center;
    cursor: pointer;
    display: flex;
    &&& {
        padding: 10px 0;
    }
`;

const AccountTextWrapper = styled.div`
    margin-left: 10px;
    width: 100%;
`;

const AccounTextSubWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const ChevronIcon = styled.svg`
    height: 16px;
    width: 16px;
`;

const AccountName = styled.div``;

const AccountType = styled(({ subtype, ...rest }) => <div {...rest} />)<{ subtype: string }>`
    font-size: 12px;
    opacity: 0.75;
    text-transform: ${({ subtype }) => {
        // eslint-disable-next-line prettier/prettier
        const allCapsSubtypes = [
            'cd',
            'hsa',
            'gic',
            'ira',
            'isa',
            'keogh',
            'lif',
            'lira',
            'lrsp',
            'prif',
            'qshr',
            'rdsp',
            'resp',
            'rlif',
            'rrif',
            'rrsp',
            'sarsep',
            'sep ira',
            'sipp',
            'tfsa',
            'ugma',
            'utma',
        ];
        if (allCapsSubtypes.indexOf(subtype) !== -1) {
            return 'uppercase';
        }
        return 'capitalize';
    }};
`;

const Money = styled.div`
    margin-left: auto;
`;

const FormSubWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const FormName = styled(Form.Group)`
    flex: 1;
`;

const FormNameLabel = styled(Form.Label)`
    font-size: 16px;
    margin-bottom: 5px;
`;

const FormNameControl = styled(Form.Control)`
    align-items: center;
    display: flex;
    height: 30px;
    &&& {
        font-size: 16px;
    }
`;

const FormSwitch = styled(Form.Check)`
    margin: 0 20px;
`;

const Buttons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
`;

export default AccountList;
