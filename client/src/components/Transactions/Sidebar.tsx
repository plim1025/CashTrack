// REACT //
import React from 'react';

// COMPONENTS //
import { ListGroup } from 'react-bootstrap';

interface Props {
    accounts: any;
    selectedAccount: string;
    setSelectedAccount: (selectedAccount: string) => void;
}

const Sidebar: React.FC<Props> = props => {
    return (
        <ListGroup>
            {props.accounts.map((account: any) => (
                <ListGroup.Item>{account.name}</ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default Sidebar;
