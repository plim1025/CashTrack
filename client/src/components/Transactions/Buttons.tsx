/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
// REACT //
import React, { useContext } from 'react';

// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';
import { Button } from 'react-bootstrap';

// CONTEXT //
import { ResourcesContext } from '../../App';

interface Props {
    showModal: () => void;
    handleEditButton: () => void;
    handleDeleteButton: () => void;
}

const Buttons: React.FC<Props> = props => {
    const { refresh } = useContext(ResourcesContext);

    return (
        <div className={css(ss.wrapper)}>
            <Button
                onClick={() => props.showModal()}
                className={css(ss.button)}
            >
                +
                <div className={css(ss.buttonText)}>&nbsp;Add</div>
            </Button>
            <Button
                variant='secondary'
                onClick={() => props.handleEditButton()}
                className={css(ss.button)}
            >
                <svg className={css(ss.icon)} viewBox="0 0 512 512">
                    <polygon points="51.2,353.28 0,512 158.72,460.8" />
                    <rect x="89.73" y="169.097" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -95.8575 260.3719)" width="353.277" height="153.599" />
                    <path d="M504.32,79.36L432.64,7.68c-10.24-10.24-25.6-10.24-35.84,0l-23.04,23.04l107.52,107.52l23.04-23.04 C514.56,104.96,514.56,89.6,504.32,79.36z" />
                </svg>
                <div className={css(ss.buttonText)}>Edit</div>
            </Button>
            <Button
                variant='danger'
                onClick={() => props.handleDeleteButton()}
                className={css(ss.button)}
            >
                <svg className={css(ss.icon)} viewBox='-48 0 407 407'>
                    <path d='m89.199219 37c0-12.132812 9.46875-21 21.601562-21h88.800781c12.128907 0 21.597657 8.867188 21.597657 21v23h16v-23c0-20.953125-16.644531-37-37.597657-37h-88.800781c-20.953125 0-37.601562 16.046875-37.601562 37v23h16zm0 0' />
                    <path d='m60.601562 407h189.199219c18.242188 0 32.398438-16.046875 32.398438-36v-247h-254v247c0 19.953125 14.15625 36 32.402343 36zm145.597657-244.800781c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm0 0' />
                    <path d='m20 108h270.398438c11.046874 0 20-8.953125 20-20s-8.953126-20-20-20h-270.398438c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20zm0 0' />
                </svg>
                <div className={css(ss.buttonText)}>Delete</div>
            </Button>
            <Button
                variant='success'
                onClick={() => refresh()}
                className={css(ss.button)}
            >
                <svg className={css(ss.icon)} viewBox='0 0 512 512'>
                    <path d='M493.815,70.629c-11.001-1.003-20.73,7.102-21.733,18.102l-2.65,29.069C424.473,47.194,346.429,0,256,0 C158.719,0,72.988,55.522,30.43,138.854c-5.024,9.837-1.122,21.884,8.715,26.908c9.839,5.024,21.884,1.123,26.908-8.715 C102.07,86.523,174.397,40,256,40c74.377,0,141.499,38.731,179.953,99.408l-28.517-20.367c-8.989-6.419-21.48-4.337-27.899,4.651 c-6.419,8.989-4.337,21.479,4.651,27.899l86.475,61.761c12.674,9.035,30.155,0.764,31.541-14.459l9.711-106.53 C512.919,81.362,504.815,71.632,493.815,70.629z' />
                    <path d='M472.855,346.238c-9.838-5.023-21.884-1.122-26.908,8.715C409.93,425.477,337.603,472,256,472 c-74.377,0-141.499-38.731-179.953-99.408l28.517,20.367c8.989,6.419,21.479,4.337,27.899-4.651 c6.419-8.989,4.337-21.479-4.651-27.899l-86.475-61.761c-12.519-8.944-30.141-0.921-31.541,14.459l-9.711,106.53 c-1.003,11,7.102,20.73,18.101,21.733c11.014,1.001,20.731-7.112,21.733-18.102l2.65-29.069C87.527,464.806,165.571,512,256,512 c97.281,0,183.012-55.522,225.57-138.854C486.594,363.309,482.692,351.262,472.855,346.238z' />
                </svg>
                <div className={css(ss.buttonText)}>Refresh</div>
            </Button>
        </div>
    );
};

// STYLES //
const ss = StyleSheet.create({
    wrapper: {
        display: 'flex',
        '@media(max-width:750px)': {
            justifyContent: 'space-around',
        }
    },
    button: {
        // @ts-ignore
        display: 'flex !important',
        // @ts-ignore
        fontWeight: '700 !important',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'calc(25% - 40px)',
        margin: 20,
        lineHeight: 'inherit !important',
        height: 40,
        whiteSpace: 'nowrap',
        '@media(max-width:750px)': {
            width: 'initial',
        }
    },
    buttonText: {
        '@media(max-width:750px)': {
            display: 'none'
        }
    },
    icon: {
        fill: '#fff',
        height: 16,
        width: 16,
        marginRight: 8,
        '@media(max-width:750px)': {
            marginRight: 0,
        }
    },
});

export default Buttons;
