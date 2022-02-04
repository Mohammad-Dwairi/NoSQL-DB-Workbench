import React, { useContext, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import AuthContext from '../../store/auth-context';


const IndexWorkspace = props => {

    const { collectionSchema, indexes, schema, collection, setIndexes } = props;
    const [selectedProperty, setSelectedProperty] = useState('');
    const [status, setStatus] = useState({});
    const [error, setError] = useState(false);

    const authCtx = useContext(AuthContext);    

    const createIndexHandler = async () => {
        if (selectedProperty === '') return;

        const url = `${authCtx.databaseAddress}/db/ddl-write/schema/${schema}/${collection}/${selectedProperty}/index`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`
            }
        });
        
        if (!response.ok) {
            const responseData = await response.json();
            setStatus(responseData);
            setError(true);
            return;
        }

        setStatus({'status': 'OK'});
        setIndexes([...indexes, selectedProperty]);
        setError(false);
    };

    const getSchemaKeys = () => {
        return Object.keys(collectionSchema['properties']).filter(key => !indexes.includes(key));
    };

    return (
        <div>
            <Row className='mt-5'>
                <Col>
                    <select className="form-select" onChange={(e) => setSelectedProperty(e.target.value)}>
                        <option>Select property to index ..</option>
                        {getSchemaKeys().map(key => <option key={key} value={key}>{key}</option>)}
                    </select>
                </Col>
                <Col>
                    <Button onClick={createIndexHandler}>Create Index</Button>
                </Col>
            </Row>
            <div className='p-3'>
                {<p className={error ? 'text-danger' : 'text-success'}>{Object.keys(status).length !== 0 && JSON.stringify(status)}</p>}
            </div>
        </div>
    );
};

export default IndexWorkspace;