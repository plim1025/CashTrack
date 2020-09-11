// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Card } from 'react-bootstrap';
import { moneyFormat, parseAccountInfo } from '../shared/TransactionUtil';

// TYPES //
import { Account } from '../../types';

interface Props {
    accounts: Account[];
    selectedAccountID: string;
}

const AccountInfo: React.FC<Props> = props => {
    const [curAccount, setCurAccount] = useState({
        institution: '',
        name: '',
        balance: 0,
        debt: 0,
        available: 0,
        creditLimit: 0,
        type: '',
    });

    useEffect(() => {
        const accountInfo = parseAccountInfo(props.accounts, props.selectedAccountID);
        setCurAccount(accountInfo);
    }, [props.selectedAccountID, props.accounts]);

    return (
        <Card>
            <Card.Body>
                <Card.Title className={css(ss.title)}>{curAccount.institution}</Card.Title>
                <Card.Subtitle className={css(ss.subtitle)}>{curAccount.name}</Card.Subtitle>
            </Card.Body>
            <div className={css(ss.accountSummary)}>
                {curAccount.balance !== null ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>
                            {props.selectedAccountID === 'All Accounts'
                                ? 'Total Balance'
                                : 'Balance'}
                        </div>
                        <div className={css(ss.accountSummaryMoney)}>
                            {moneyFormat(curAccount.balance)}
                        </div>
                    </div>
                ) : null}
                {curAccount.available !== null ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>
                            {curAccount.type === 'credit' ? 'Available Credit' : 'Available'}
                        </div>
                        <div className={css(ss.accountSummaryMoney)}>
                            {moneyFormat(curAccount.available)}
                        </div>
                    </div>
                ) : null}
                {curAccount.debt !== null ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Total Debt</div>
                        <div className={css(ss.accountSummaryMoney)}>
                            {moneyFormat(curAccount.debt)}
                        </div>
                    </div>
                ) : null}
                {curAccount.creditLimit !== null ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Credit Limit</div>
                        <div className={css(ss.accountSummaryMoney)}>
                            {moneyFormat(curAccount.creditLimit)}
                        </div>
                    </div>
                ) : null}
            </div>
        </Card>
    );
};

// STYLES //
const ss = StyleSheet.create({
    title: {
        // @ts-ignore
        fontWeight: '700 !important',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.75,
    },
    accountSummary: {
        display: 'flex',
        padding: '1.25rem',
        paddingTop: 0,
    },
    accountSummaryItem: {
        marginRight: 25,
    },
    accountSummaryTitle: {
        textTransform: 'uppercase',
        fontSize: 14,
        opacity: 0.75,
    },
    accountSummaryMoney: {
        fontWeight: 700,
    },
});

export default AccountInfo;
