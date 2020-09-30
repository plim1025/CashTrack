// REACT //
import React from 'react';

// COMPONENTS //
import Button from '../shared/Button';

interface Props {
    openAddModal: () => void;
}

const AddButton: React.FC<Props> = props => {
    return (
        <Button child='+ Budget' onClick={() => props.openAddModal()} style={{ margin: 'auto' }} />
    );
};

export default AddButton;
