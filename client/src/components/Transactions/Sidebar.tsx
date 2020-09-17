/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';

// TYPES //
import { Account } from '../../types';

interface Props {
    accounts: Account[];
    selectedAccountID: string;
    setSelectedAccountID: (selectedAccount: string) => void;
}

const Sidebar: React.FC<Props> = props => {
    return (
        <Wrapper>
            <AllAccounts
                onClick={() => props.setSelectedAccountID('All Accounts')}
                selectedAccountID={props.selectedAccountID}
            >
                <AccountTitle>All Accounts</AccountTitle>
                <AccountSubtitle>{props.accounts.length} accounts</AccountSubtitle>
            </AllAccounts>
            {props.accounts.map((account: Account, index: number) => (
                <Account
                    key={account.id}
                    id={account.id}
                    index={index}
                    lastAccountIndex={props.accounts.length - 1}
                    onClick={() => props.setSelectedAccountID(account.id)}
                    selectedAccountID={props.selectedAccountID}
                    
                >
                    <AccountTitle>{account.institution}</AccountTitle>
                    <AccountSubtitle>{account.name} (...{account.mask})</AccountSubtitle>
                </Account>
            ))}
        </Wrapper>
    );
};

// STYLES //
const Wrapper = styled.nav`
    margin-bottom: 20px;
    margin-top: calc(20px + 1.25rem);
    max-width: 250px;
    min-width: 200px;
`;

const AllAccounts = styled(({ selectedAccountID, ...rest}) => <div {...rest} />)<{ selectedAccountID: string }>`
    background: ${({ selectedAccountID }) => selectedAccountID === 'All Accounts' && '#007bff'};
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    color: ${({ selectedAccountID }) => selectedAccountID === 'All Accounts' && '#fff'};
    cursor: pointer;
    padding: 10px;
    &:hover {
        color: ${({ selectedAccountID }) => selectedAccountID === 'All Accounts' ? '#fff' : '#007bff'};
    }
`;

const Account = styled(({ selectedAccountID, id, index, lastAccountIndex, ...rest}) => <div {...rest} />)<{ selectedAccountID: string; id: string; index: number; lastAccountIndex: number }>`
    background: ${({ selectedAccountID, id }) => selectedAccountID === id && '#007bff'};
    border-bottom: ${({ index, lastAccountIndex }) => index === lastAccountIndex && '1px solid #dee2e6'};
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    color: ${({ selectedAccountID, id }) => selectedAccountID === id && '#fff'};
    cursor: pointer;
    padding: 10px;
    &:hover {
        color: ${({ selectedAccountID, id }) => selectedAccountID === id ? '#fff' : '#007bff'};
    }
`;

const AccountTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
`;

const AccountSubtitle = styled.div`
    font-size: 14px;
    opacity: 0.75;
`;

export default Sidebar;
