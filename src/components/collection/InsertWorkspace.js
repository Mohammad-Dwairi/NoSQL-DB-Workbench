import React, { useContext, useRef, useState } from 'react';
import { Button, Col, Row, Stack } from 'react-bootstrap';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en'

import AuthContext from '../../store/auth-context';
import DocumentInput from './DocumentInput';
import QueryControl from './QueryControl';


const InsertWorkspace = props => {

    const { schema, collection, collectionSchema } = props;

    const [isloading, setIsLoading] = useState(false);
    const [insertedData, setInsertedData] = useState({});
    const [returnedData, setReturnedData] = useState({});

    const authCtx = useContext(AuthContext);


    const insertHandler = async () => {
        if (Object.keys(insertedData?.jsObject).length === 0) {
            return;
        }
        setIsLoading(true);
        const url = `${authCtx.databaseAddress}/db/dml-write/schema/${schema}/${collection}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json'
            },
            body: insertedData?.json
        });

        const responseData = await response.json();
        setReturnedData(responseData);
        setIsLoading(false);
    };


    return (
        <Row className='mt-4'>
            <Col className='d-flex flex-column'>
                <h4>Insert New Document Here</h4>
                <DocumentInput onInsert={setInsertedData} returnedValue={returnedData} />
                <Button
                    onClick={insertHandler}
                    disabled={isloading}
                    className='m-2 w-50 align-self-center'
                    style={{ float: 'right' }}>
                    {isloading ? 'Inserting...' : 'Insert'}
                </Button>
            </Col>
            <Col>
                <h4>Collection JSON Schema</h4>
                <JSONInput
                    theme='light_mitsuketa_tribute'
                    viewOnly
                    placeholder={collectionSchema}
                    locale={locale}
                    height='550px'
                    width='auto'
                    style={{ contentBox: { fontWeight: 'bold', fontSize: '13px' } }}
                />
            </Col>
        </Row>

    );
};

export default InsertWorkspace;