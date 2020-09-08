// REACT //
import React, { useState, useEffect, useRef } from 'react';

// COMPONENTS //
import { Button, Form, Modal } from 'react-bootstrap';
import Error from '../shared/Error';

interface Props {
    toggled: boolean;
    toggle: (toggle: boolean) => void;
    handleCreateTransaction: (transaction: any) => void;
}

const ModalOverlay: React.FC<Props> = props => {
    let errorTimeout: ReturnType<typeof setTimeout>;
    const ISODate = new Date().toISOString().slice(0, 10);
    const modalRef = useRef(null);
    const [transaction, setTransaction] = useState({
        date: ISODate,
        description: '',
        category: '',
        amount: '',
    });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const createTransaction = async (e: any) => {
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
            props.handleCreateTransaction(transaction);
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
            centered
            onShow={() => modalRef.current.focus()}
            onHide={() => props.toggle(false)}
            show={props.toggled}
        >
            <Error error={error} errorMessage={errorMessage} />
            <Form>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            className='form-control editor edit-date'
                            defaultValue={ISODate}
                            onChange={e => setTransaction({ ...transaction, date: e.target.value })}
                            type='date'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            onChange={e =>
                                setTransaction({
                                    ...transaction,
                                    description: e.target.value,
                                })
                            }
                            ref={modalRef}
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
                    <Button onClick={() => props.toggle(false)} size='sm' variant='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={createTransaction} size='sm' type='submit' variant='primary'>
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalOverlay;
