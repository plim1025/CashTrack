// REACT //
import React from 'react';

// ROUTER //
import { withRouter } from 'react-router';

// REDUX //
import { useSelector, useDispatch } from 'react-redux';
import { loadSubpage, logout } from '../../redux/Actions';
import { RootState } from '../../redux/Store';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

interface Props {
    history: any;
}

const Header: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const reduxEmail = useSelector((redux: RootState) => redux.email);
    const reduxSubpage = useSelector((redux: RootState) => redux.subpage);

    const changeLink = (subpage: string) => {
        dispatch(loadSubpage(subpage));
        window.history.replaceState(null, '', `/${subpage}`);
    };

    return (
        <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
            <Navbar.Brand>
                <svg
                    className={css(ss.logo)}
                    onClick={() => changeLink('home')}
                    viewBox='0 0 1698.4 493'
                >
                    <path d='M470.9,13.2C450,4.7,422.7,0,394,0s-56,4.7-76.9,13.2c-31.8,13-39.6,31.1-40.9,42.8H276V217.8c-6.5-.5-13.2-.8-20-.8s-13.5.3-20,.8V136h-.2c-1.3-11.7-9-29.8-40.9-42.8C174,84.7,146.7,80,118,80S62,84.7,41.1,93.2C5.3,107.8,0,128.8,0,140V376c0,11.2,5.3,32.2,41.1,46.8C62,431.3,89.3,436,118,436c6.8,0,13.5-.3,20.1-.8.7,11.6,7.5,30.9,41,44.6C200,488.3,227.3,493,256,493s56-4.7,76.9-13.2C368.7,465.2,374,444.2,374,433v-.8c6.6.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2C506.7,405.2,512,384.2,512,373V60C512,48.8,506.7,27.8,470.9,13.2ZM394,40c46.2,0,72.9,13.5,77.6,20-4.7,6.5-31.4,20-77.6,20s-72.9-13.5-77.6-20C321.1,53.5,347.8,40,394,40ZM256,257c46.2,0,72.9,13.5,77.6,20h-.1l-.3.3-.3.4-.3.3-.4.4-.3.3-.5.4-.4.4a1,1,0,0,0-.5.4l-.5.3-.6.5-.6.3-.7.5-.6.3-.8.5-.6.4-.9.5-.6.3-1.1.5-.6.4-1.4.6-.4.2-2,.9h-.3l-1.7.7-.8.3-1.4.6-1,.3-1.4.5-1,.3-1.4.5-1.1.4-1.5.4-1.2.3-1.5.5-1.3.3-1.6.4-1.3.3-1.6.4-1.4.3-1.7.4-1.5.3-1.8.3-1.5.3-1.8.3-1.6.3-1.9.3-1.6.2-2,.2-1.7.2-2.1.3h-1.7l-2.1.2-1.8.2h-4l-2.5.2H245.7l-2.5-.2h-4l-1.8-.2-2.1-.2h-1.7l-2.1-.3-1.7-.2-2-.2-1.6-.2-1.9-.3-1.6-.3-1.8-.3-1.5-.3-1.8-.3-1.5-.3-1.7-.4-1.4-.3-1.6-.4-1.3-.3-1.6-.4-1.3-.3-1.5-.5-1.2-.3-1.5-.4-1.1-.4-1.4-.5-1-.3L198,288l-.9-.3-1.4-.6-.8-.3-1.7-.7h-.4l-1.9-.9-.4-.2-1.4-.6-.6-.4-1.1-.5-.6-.3-.9-.5-.7-.4-.7-.5-.6-.3-.7-.5-.6-.3-.6-.5-.5-.3a1,1,0,0,0-.5-.4c-.1-.2-.3-.3-.4-.4l-.5-.4-.3-.3-.4-.4-.3-.3-.3-.4-.3-.3h-.1C183.1,270.5,209.8,257,256,257ZM118,120c46.2,0,72.9,13.5,77.6,20-4.7,6.5-31.4,20-77.6,20s-72.9-13.5-77.6-20C45.1,133.5,71.8,120,118,120Zm20,275.1c-6.5.6-13.2.9-20,.9-47.8,0-74.7-14.5-78-20.6V345.3l1.1.5C62,354.3,89.3,359,118,359c6.8,0,13.4-.3,20-.8ZM138,280v38.1c-6.5.6-13.2.9-20,.9-47.9,0-74.8-14.5-78-20.7v-33l1.1.5C62,274.3,89.3,279,118,279c6.8,0,13.5-.3,20-.8,0,.6.1,1.2.1,1.8Zm-20-41c-47.9,0-74.8-14.5-78-20.7v-32l1.1.5C62,195.3,89.3,200,118,200s56-4.7,76.9-13.2l1.1-.5v32C192.8,224.5,165.9,239,118,239ZM334,432.4c-3.3,6.1-30.2,20.6-78,20.6s-74.7-14.5-78-20.6V400.3l1.1.5C200,409.3,227.3,414,256,414s56-4.7,76.9-13.2l1.1-.5Zm0-79.1c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-30l1.1.5C200,332.3,227.3,337,256,337s56-4.7,76.9-13.2l1.1-.5Zm138,19.1c-3.3,6.1-30.2,20.6-78,20.6-6.8,0-13.5-.3-20-.9V355.2c6.6.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2l1.1-.5Zm0-77.1c-3.2,6.2-30.1,20.7-78,20.7-6.8,0-13.5-.3-20-.9V280h-.1c0-.6.1-1.2.1-1.8,6.5.5,13.2.8,20,.8,28.7,0,56-4.7,76.9-13.2l1.1-.5Zm0-77c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-33l1.1.5C338,194.3,365.3,199,394,199s56-4.7,76.9-13.2l1.1-.5Zm0-80c-3.2,6.2-30.1,20.7-78,20.7s-74.8-14.5-78-20.7v-32l1.1.5C338,115.3,365.3,120,394,120s56-4.7,76.9-13.2l1.1-.5Z' />
                    <text className={css(ss.logoText)} transform='translate(665 297)'>
                        CashTrack
                    </text>
                </svg>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav>
                    <Nav.Link
                        onClick={() => changeLink('home')}
                        style={{ color: reduxSubpage === 'home' ? '#fff' : '' }}
                    >
                        Home
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => changeLink('transactions')}
                        style={{ color: reduxSubpage === 'transactions' ? '#fff' : '' }}
                    >
                        Transactions
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => changeLink('trends')}
                        style={{ color: reduxSubpage === 'trends' ? '#fff' : '' }}
                    >
                        Trends
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => changeLink('budgets')}
                        style={{ color: reduxSubpage === 'budgets' ? '#fff' : '' }}
                    >
                        Budgets
                    </Nav.Link>
                </Nav>
                <Nav className={css(ss.navDropdown)}>
                    <NavDropdown
                        id='basic-nav-dropdown'
                        title={reduxEmail || sessionStorage.getItem('email') || ''}
                    >
                        <NavDropdown.Item onClick={() => changeLink('accounts')}>
                            Accounts
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => changeLink('accounts')}>
                            Settings
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={() => dispatch(logout(props.history))}>Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

// STYLES //
const ss = StyleSheet.create({
    logo: {
        cursor: 'pointer',
        fill: '#0dfc94',
        height: 40,
        width: 200,
        marginRight: 'auto',
    },
    logoText: {
        fontSize: 200,
        fontFamily: 'Open Sans',
        fontWeight: 600,
    },
    navDropdown: {
        marginLeft: 'auto',
    },
});

export default withRouter(Header);
