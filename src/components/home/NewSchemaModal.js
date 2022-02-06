import React, { useContext, useRef } from 'react';
import { Button, FormControl, Modal } from 'react-bootstrap';
import AuthContext from '../../store/auth-context';


const NewSchemaModal = props => {

    const { visible, setVisible, schemaLoader } = props;
    const newSchemaInputRef = useRef();
    const authctx = useContext(AuthContext);

    const createSchemaHandler = async () => {
        const newSchemaName = newSchemaInputRef.current.value;
        if (newSchemaName.trim() === '') return;
        const url = `${authctx.databaseAddress}/db/ddl-write/schema`;
        const response = fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authctx.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'schemaName': newSchemaName })
        });

        if ((await response).ok) {
            setVisible(false);
            newSchemaInputRef.current.value = ''
            schemaLoader();
        }
    };


    return (
        <Modal
            show={visible}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Schema
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl ref={newSchemaInputRef} placeholder="Schema Name" />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={createSchemaHandler}>Save</Button>
                <Button variant="outline-danger" onClick={() => setVisible(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewSchemaModal;