// REACT //
import React, { useState, useEffect } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import { Card } from 'react-bootstrap';

// TYPES //
import { Account } from '../../types';

// UTIL //
import { moneyFormat } from '../shared/SharedUtils';
import { parseAccountInfo } from './TransactionUtil';

interface Props {
    accounts: Account[];
    selectedAccountID: string;
    balance: number;
}

const AccountInfo: React.FC<Props> = props => {
    const [curAccount, setCurAccount] = useState<Account>(null);

    useEffect(() => {
        const accountInfo = parseAccountInfo(
            props.accounts,
            props.selectedAccountID,
            props.balance
        );
        setCurAccount(accountInfo);
    }, [props.selectedAccountID, props.accounts, props.balance]);

    return (
        <Card>
            <Card.Body>
                <CardTitleWrapper>{curAccount ? curAccount.institution : null}</CardTitleWrapper>
                <CardSubtitleWrapper>{curAccount ? curAccount.name : null}</CardSubtitleWrapper>
            </Card.Body>
            <Wrapper>
                {curAccount && props.balance !== null ? (
                    <Item>
                        <Title>
                            {props.selectedAccountID === 'All Accounts'
                                ? 'Total Balance'
                                : 'Balance'}
                        </Title>
                        <Money>{moneyFormat(props.balance)}</Money>
                    </Item>
                ) : null}
                {curAccount && curAccount.available !== null ? (
                    <Item>
                        <Title>
                            {curAccount.type === 'credit' ? 'Available Credit' : 'Available'}
                        </Title>
                        <Money>{moneyFormat(curAccount.available)}</Money>
                    </Item>
                ) : null}
                {curAccount && curAccount.creditLimit !== null ? (
                    <Item>
                        <Title>Credit Limit</Title>
                        <Money>{moneyFormat(curAccount.creditLimit)}</Money>
                    </Item>
                ) : null}
            </Wrapper>
        </Card>
    );
};

// STYLES //
const Wrapper = styled.div`
    display: flex;
    padding: 1.25rem;
    padding-top: 0;
`;

const CardTitleWrapper = styled(Card.Title)`
    &&& {
        font-weight: 700;
    }
`;

const CardSubtitleWrapper = styled(Card.Subtitle)`
    font-size: 16px;
    opacity: 0.75;
`;

const Item = styled.div`
    margin-right: 25px;
`;

const Title = styled.div`
    font-size: 16px;
    opacity: 0.75;
    text-transform: uppercase;
`;

const Money = styled.div`
    font-weight: 700;
`;

export default AccountInfo;
