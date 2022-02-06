import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const AppModal = props => {

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.heading}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onSave}>Save</Button>
                <Button variant="outline-danger" onClick={props.onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppModal;