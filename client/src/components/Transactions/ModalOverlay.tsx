// REACT //
import React, { useState, useEffect, useRef } from 'react';

// REDUX //
import { useDispatch } from 'react-redux';
import { createTransaction } from '../../redux/Actions';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import Error from '../shared/Error';

const ISODate = new Date().toISOString().slice(0, 10);

interface Props {
    toggled: boolean;
    toggle: (toggle: boolean) => void;
}

const ModalOverlay: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const [transaction, setTransaction] = useState({
        date: ISODate,
        description: '',
        category: '',
        amount: '',
    });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const addTransaction = (e: any) => {
        e.preventDefault();
        if (!transaction.date) {
            setError(true);
            setErrorMessage('Invalid date');
        } else if (isNaN(transaction.amount as any) || !transaction.amount) {
            setError(true);
            setErrorMessage('Amount should be numeric');
        } else if (parseInt(transaction.amount) > 1000000000) {
            setError(true);
            setErrorMessage('Maximum amount is $1,000,000,000');
        } else {
            dispatch(createTransaction(transaction));
            props.toggle(false);
        }
        errorTimeout = setTimeout(() => setError(false), 3000);
    };

    useEffect(() => {
        return () => {
            clearTimeout(errorTimeout);
        };
    }, []);

    return (
        <Modal
            show={props.toggled}
            onShow={() => modalRef.current.focus()}
            onHide={() => props.toggle(false)}
            centered
        >
            <Error error={error} errorMessage={errorMessage} />
            <Form>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type='date'
                            defaultValue={ISODate}
                            className='form-control editor edit-date'
                            onChange={e => setTransaction({ ...transaction, date: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            ref={modalRef}
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    description: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    category: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    amount: e.target.value,
                                })
                            }
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => props.toggle(false)} variant='secondary' size='sm'>
                        Cancel
                    </Button>
                    <Button onClick={addTransaction} variant='primary' size='sm' type='submit'>
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalOverlay;
