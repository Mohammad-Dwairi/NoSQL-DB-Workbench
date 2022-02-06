import React, { useContext, useState } from 'react';
import { Button, Col, FormControl, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';


const DropCollectionWorkspace = props => {

    const { schema, collection } = props;
    const [enteredCollection, setEnteredCollection] = useState('');

    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const dropCollectionHandler = async () => {

        if (collection !== enteredCollection) return;
        const url = `${authCtx.databaseAddress}/db/ddl-write/schema/${schema}/${collection}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`
            }
        });

        if (response.ok) {
            history.replace(`/schema/${schema}`);
        }
    };


    return (
        <Row className='my-5'>
            <Col>
                <FormControl placeholder="Enter collection name to confirm" onChange={e => setEnteredCollection(e.target.value)}/>
            </Col>
            <Col>
                <Button variant='danger' disabled={enteredCollection !== collection} onClick={dropCollectionHandler}>Drop</Button>
            </Col>
        </Row>
    );
};

export default DropCollectionWorkspace;