// REACT //
import React, { useReducer, useEffect, useContext } from 'react';

// COMPONENTS //
import PlaidLinkButton from '../components/Accounts/PlaidLinkButton';
import AccountList from '../components/Accounts/AccountList';
import AccountDeleteModal from '../components/Accounts/AccountDeleteModal';
import FallbackSpinner from '../components/shared/FallbackSpinner';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Account } from '../types';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_TOKEN'; token: string }
    | { type: 'SHOW_ACCOUNT_MODAL'; account: Account }
    | { type: 'HIDE_ACCOUNT_MODAL' }
    | { type: 'SHOW_ACCOUNT_DELETE_MODAL'; batchID: string }
    | { type: 'HIDE_ACCOUNT_DELETE_MODAL' };

interface ReducerState {
    loading: boolean;
    token: string;
    modal: {
        show: boolean;
        batchID: string;
    };
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_TOKEN':
            return { ...state, token: action.token };
        case 'SHOW_ACCOUNT_DELETE_MODAL':
            return { ...state, modal: { show: true, batchID: action.batchID } };
        case 'HIDE_ACCOUNT_DELETE_MODAL':
            return { ...state, modal: { show: false, batchID: '' } };
        default:
            return state;
    }
};

const Accounts: React.FC = () => {
    const { accounts } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        token: '',
        modal: {
            show: false,
            batchID: '',
        },
    });

    useEffect(() => {
        const getLinkToken = async () => {
            try {
                const response = await fetch(
                    `${process.env.BACKEND_URI}/api/plaid/create_link_token`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    }
                );
                if (!response.ok) {
                    throw Error('Bad response from server');
                }
                const newLinkToken = await response.json();
                dispatch({ type: 'SET_TOKEN', token: newLinkToken });
            } catch (error) {
                throw Error(`Error fetching link token: ${error}`);
            }
        };
        getLinkToken();
    }, []);

    if (!state.token) {
        return <FallbackSpinner backdrop show />;
    }
    return (
        <>
            <PlaidLinkButton token={state.token} />
            <AccountList
                setLoading={(loading: boolean) =>
                    dispatch({ type: 'SET_LOADING', loading: loading })
                }
                accounts={accounts}
                openAccountDeleteModal={(batchID: string) =>
                    dispatch({ type: 'SHOW_ACCOUNT_DELETE_MODAL', batchID: batchID })
                }
            />
            <AccountDeleteModal
                setLoading={(loading: boolean) =>
                    dispatch({ type: 'SET_LOADING', loading: loading })
                }
                show={state.modal.show}
                close={() => dispatch({ type: 'HIDE_ACCOUNT_DELETE_MODAL' })}
                batchID={state.modal.batchID}
            />
            <FallbackSpinner backdrop show={state.loading} />
        </>
    );
};

export default Accounts;
