/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
// REACT //
import React from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';

// TYPES //
import { Account } from '../../types';

interface Props {
    accounts: Account[];
    selectedAccountID: string;
    setSelectedAccountID: (selectedAccount: string) => void;
}

const Sidebar: React.FC<Props> = props => {
    return (
        <div className={css(ss.wrapper)}>
            <div
                className={css(ss.account)}
                onClick={() => props.setSelectedAccountID('All Accounts')}
                style={{
                    background: props.selectedAccountID === 'All Accounts' ? '#007bff' : '',
                    color: props.selectedAccountID === 'All Accounts' ? '#fff' : '',
                }}
            >
                <div className={css(ss.accountTitle)}>All Accounts</div>
                <div className={css(ss.accountSubtitle)}>{props.accounts.length} accounts</div>
            </div>
            {props.accounts.map((account: Account, index: number) => (
                <div
                    key={account.id}
                    onClick={() => props.setSelectedAccountID(account.id)}
                    className={css(ss.account)}
                    style={{
                        background: props.selectedAccountID === account.id ? '#007bff' : '',
                        color: props.selectedAccountID === account.id ? '#fff' : '',
                        borderBottom:
                            index === props.accounts.length - 1 ? '1px solid #dee2e6' : '',
                    }}
                >
                    <div className={css(ss.accountTitle)}>{account.institution}</div>
                    <div className={css(ss.accountSubtitle)}>{account.name} (...{account.mask})</div>
                </div>
            ))}
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        marginTop: 100,
        background: '#f0f0f0',
        width: 220,
    },
    account: {
        borderTop: '1px solid #dee2e6',
        borderOpacity: 0.5,
        padding: 10,
        cursor: 'pointer',
        ':hover': {
            color: '#007bff',
        },
    },
    accountTitle: {
        fontSize: 16,
    },
    accountSubtitle: {
        fontSize: 12,
        opacity: 0.75,
    },
});

export default Sidebar;
