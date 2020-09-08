// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Card } from 'react-bootstrap';

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
        balance: null,
        debt: null,
        available: null,
        creditLimit: null,
        type: null,
    });

    useEffect(() => {
        if (props.selectedAccountID === 'All Accounts') {
            const totalBalance = props.accounts
                .map((account: Account) =>
                    account.type === 'investment' ||
                    account.type === 'depository' ||
                    account.type === 'other'
                        ? account.balance
                        : 0
                )
                .reduce((total: number, balance: number) => total + balance)
                .toFixed(2);
            const totalDebt = props.accounts
                .map((account: Account) =>
                    account.type === 'credit' || account.type === 'loan' ? account.balance : 0
                )
                .reduce((total: number, debt: number) => total + debt)
                .toFixed(2);
            setCurAccount({
                institution: 'All Accounts',
                name: `${props.accounts.length} accounts`,
                balance: totalBalance,
                debt: totalDebt,
                available: null,
                creditLimit: null,
                type: null,
            });
        } else {
            const selectedAccount = props.accounts.find(
                (account: Account) => account.id === props.selectedAccountID
            );
            let available = null;
            if (selectedAccount.type === 'credit') {
                available = (selectedAccount.creditLimit - selectedAccount.balance).toFixed(2);
            } else if (selectedAccount.available) {
                available = selectedAccount.available.toFixed(2);
            }
            setCurAccount({
                institution: selectedAccount.institution,
                name: selectedAccount.name,
                balance: selectedAccount.balance.toFixed(2),
                debt: null,
                available: available,
                creditLimit: selectedAccount.creditLimit || null,
                type: selectedAccount.type,
            });
        }
    }, [props.selectedAccountID, props.accounts]);

    const moneyFormat = (money: number) => {
        if (money < 0) {
            return `-$${Math.abs(money)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return `$${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>{curAccount.institution}</Card.Title>
                <Card.Subtitle className={css(ss.subtitle)}>{curAccount.name}</Card.Subtitle>
            </Card.Body>
            <div className={css(ss.accountSummary)}>
                {curAccount.balance ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>
                            {props.selectedAccountID === 'All Accounts'
                                ? 'Total Balance'
                                : 'Balance'}
                        </div>
                        <div>{moneyFormat(curAccount.balance)}</div>
                    </div>
                ) : null}
                {curAccount.available ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>
                            {curAccount.type === 'credit' ? 'Available Credit' : 'Available'}
                        </div>
                        <div>{moneyFormat(curAccount.available)}</div>
                    </div>
                ) : null}
                {curAccount.debt ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Total Debt</div>
                        <div>{moneyFormat(curAccount.debt)}</div>
                    </div>
                ) : null}
                {curAccount.creditLimit ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Credit Limit</div>
                        <div>{moneyFormat(curAccount.creditLimit)}</div>
                    </div>
                ) : null}
            </div>
        </Card>
    );
};

// STYLES //
const ss = StyleSheet.create({
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
});

export default AccountInfo;
