import React from 'react';
import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';


const QueryControl = props => {

    const { indexChangeHandler, valueInputRef, onExecute, indexes, buttonLabel } = props;
    
    return (
        <Row>
            <Col sm='4'>
                <select className="form-select" onChange={indexChangeHandler}>
                    <option value='defaultId'>Defualt ID Index</option>
                    {indexes.map(idx => <option key={idx} value={idx}>{idx}</option>)}
                </select>
            </Col>
            <Col sm='4'>
                <InputGroup className="mb-3">
                    <InputGroup.Text>Value</InputGroup.Text>
                    <FormControl
                      
                        ref={valueInputRef}
                        placeholder="Value to be matched"
                    />
                </InputGroup>
            </Col>
            {onExecute && <Col sm='4'>
                <Button onClick={onExecute} className='d-flex justify-content-center align-items-center'>
                    {buttonLabel}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right mx-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </Button>
            </Col>}
        </Row>
    );
};

export default QueryControl;