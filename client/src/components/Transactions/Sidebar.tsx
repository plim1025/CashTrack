/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
// REACT //
import React, { useState, useEffect, useRef } from 'react';

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
    const [minified, setMinified] = useState(window.innerWidth < 750);
    const [expanded, setExpanded] = useState(false);
    const prevWindowWidth = useRef(window.innerWidth);

    useEffect(() => {
        const resizeListener = () => {
            console.log('here');
            if (prevWindowWidth.current > 750 && window.innerWidth <= 750) {
                console.log('set mini');
                setMinified(true);
            } else if (prevWindowWidth.current <= 750 && window.innerWidth > 750) {
                console.log('off mini');
                setMinified(false);
                setExpanded(false);
            }
            prevWindowWidth.current = window.innerWidth;
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    return (
        <Wrapper
            style={{
                left: expanded ? 0 : -250,
                boxShadow: expanded ? '#6c757d 1px -1px 4px 1px' : null,
            }}
        >
            {minified ? (
                <Expander
                    onClick={() => setExpanded(prevExpanded => !prevExpanded)}
                    style={{
                        left: expanded ? 'calc(230px - 1.25rem)' : 250,
                        border: expanded ? 0 : '2px solid rgb(187, 187, 187)',
                        borderRadius: expanded ? 0 : '0 9px 9px 0',
                    }}
                >
                    <ChevronIcon
                        viewBox='0 0 256 256'
                        style={{
                            transform: expanded ? 'rotate(90deg)' : 'rotate(270deg)',
                        }}
                    >
                        <polygon points='225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093' />
                    </ChevronIcon>
                </Expander>
            ) : null}
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
    background: #f0f0f0;
    margin-bottom: 20px;
    width: 250px;
    z-index: 1;
    @media (max-width: 750px) {
        position: fixed;
    }
`;

const AllAccounts = styled(({ selectedAccountID, ...rest }) => <div {...rest} />)<{
    selectedAccountID: string;
}>`
    background: ${({ selectedAccountID }) => selectedAccountID === 'All Accounts' && '#007bff'};
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    color: ${({ selectedAccountID }) => selectedAccountID === 'All Accounts' && '#fff'};
    cursor: pointer;
    padding: 10px;
    &:hover {
        color: ${({ selectedAccountID }) =>
            selectedAccountID === 'All Accounts' ? '#fff' : '#007bff'};
    }
`;

const Account = styled(({ selectedAccountID, id, index, lastAccountIndex, ...rest }) => (
    <div {...rest} />
))<{ selectedAccountID: string; id: string; index: number; lastAccountIndex: number }>`
    background: ${({ selectedAccountID, id }) => selectedAccountID === id && '#007bff'};
    border-bottom: ${({ index, lastAccountIndex }) =>
        index === lastAccountIndex && '1px solid #dee2e6'};
    border-top: 1px solid rgba(222, 226, 230, 0.5);
    color: ${({ selectedAccountID, id }) => selectedAccountID === id && '#fff'};
    cursor: pointer;
    padding: 10px;
    &:hover {
        color: ${({ selectedAccountID, id }) => (selectedAccountID === id ? '#fff' : '#007bff')};
    }
`;

const AccountTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
`;

const AccountSubtitle = styled.div`
    font-size: 12px;
    opacity: 0.75;
`;

const Expander = styled.div`
    align-items: center;
    background: #f0f0f0;
    bottom: calc(100% - 95px);
    display: flex;
    fill: rgb(64, 64, 64);
    height: calc(20px + 1.25rem);
    justify-content: center;
    position: relative;
    width: calc(20px + 1.25rem);
    &:hover {
        background: rgba(0, 123, 255, 0.25);
        cursor: pointer;
    }
`;

const ChevronIcon = styled.svg`
    height: 16px;
    width: 16px;
`;

export default Sidebar;
