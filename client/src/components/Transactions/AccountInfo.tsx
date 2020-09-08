// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Card } from 'react-bootstrap';

interface Props {
    accounts: any;
    selectedAccountID: string;
}

const AccountInfo: React.FC<Props> = props => {
    const [account, setAccount] = useState({
        institution: '',
        name: '',
        balance: 0,
        debt: null,
        available: null,
        creditLimit: null,
        type: null,
    });

    useEffect(() => {
        if (props.selectedAccountID === 'All Accounts') {
            const totalBalance = props.accounts
                .map((item: any) =>
                    item.type === 'investment' ||
                    item.type === 'depository' ||
                    item.type === 'other'
                        ? item.balance
                        : 0
                )
                .reduce((total: number, item: any) => total + item)
                .toFixed(2);
            const totalDebt = props.accounts
                .map((item: any) =>
                    item.type === 'credit' || item.type === 'loan' ? item.balance : 0
                )
                .reduce((total: number, item: any) => total + item)
                .toFixed(2);
            setAccount({
                institution: 'All Accounts',
                name: `${props.accounts.length} accounts`,
                balance: totalBalance,
                debt: totalDebt,
                available: null,
                creditLimit: null,
                type: null,
            });
        } else {
            const curAccount = props.accounts.find(
                (item: any) => item.id === props.selectedAccountID
            );
            let available = null;
            if (curAccount.type === 'credit') {
                available = (curAccount.creditLimit - curAccount.balance).toFixed(2);
            } else if (curAccount.available) {
                available = curAccount.available.toFixed(2);
            }
            setAccount({
                institution: curAccount.institution,
                name: curAccount.name,
                balance: curAccount.balance.toFixed(2),
                debt: null,
                available: available,
                creditLimit: curAccount.creditLimit || null,
                type: curAccount.type,
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
                <Card.Title>{account.institution}</Card.Title>
                <Card.Subtitle className={css(ss.subtitle)}>{account.name}</Card.Subtitle>
            </Card.Body>
            <div className={css(ss.accountSummary)}>
                <div className={css(ss.accountSummaryItem)}>
                    <div className={css(ss.accountSummaryTitle)}>
                        {props.selectedAccountID === 'All Accounts' ? 'Total Balance' : 'Balance'}
                    </div>
                    <div className={css(ss.accountSummaryAmount)}>
                        {moneyFormat(account.balance)}
                    </div>
                </div>
                {account.available ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>
                            {account.type === 'credit' ? 'Available Credit' : 'Available'}
                        </div>
                        <div className={css(ss.accountSummaryAmount)}>
                            {moneyFormat(account.available)}
                        </div>
                    </div>
                ) : null}
                {account.debt ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Total Debt</div>
                        <div className={css(ss.accountSummaryAmount)}>
                            {moneyFormat(account.debt)}
                        </div>
                    </div>
                ) : null}
                {account.creditLimit ? (
                    <div className={css(ss.accountSummaryItem)}>
                        <div className={css(ss.accountSummaryTitle)}>Credit Limit</div>
                        <div className={css(ss.accountSummaryAmount)}>
                            {moneyFormat(account.creditLimit)}
                        </div>
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
    accountSummaryAmount: {},
});

export default AccountInfo;
