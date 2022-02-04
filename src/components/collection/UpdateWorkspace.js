import React, { useContext, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en'
import AuthContext from '../../store/auth-context';
import DocumentInput from './DocumentInput';
import QueryControl from './QueryControl';

const UpdateWorkspace = props => {

    const { schema, collection, collectionSchema, indexes } = props;

    const [insertedData, setInsertedData] = useState({});
    const [returnedData, setReturnedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [usedIndex, setUsedIndex] = useState('defaultId');

    const searchValueRef = useRef();

    const authCtx = useContext(AuthContext);

    const updateHandler = async () => {
        const searchValue = searchValueRef.current.value;

        const query = usedIndex === 'defaultId' ? `/${searchValue}` : `?property=${usedIndex}&&value=${searchValue}`;
        
        if (searchValue.trim() === '') {
            return;
        }

        const url = `${authCtx.databaseAddress}/db/dml-write/schema/${schema}/${collection}${query}`;

        console.log(url)
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json'
            },
            body: insertedData?.json
        });

        if (!response.ok) {
            const responseData = await response.json();
            setReturnedData(responseData);
            return;
        }

        setReturnedData({ status: 'OK' })

    }

    return (
        <div className='mt-5'>
            <QueryControl
                indexChangeHandler={event => setUsedIndex(event.target.value)}
                valueInputRef={searchValueRef}
                indexes={indexes}
            />
            <Row className='mt-4'>
                <Col className='d-flex flex-column'>
                    <h4>Update Existing Document Here</h4>
                    <DocumentInput onInsert={setInsertedData} returnedValue={returnedData} />
                    <Button
                        onClick={updateHandler}
                        disabled={isLoading}
                        className='m-2 w-50 align-self-center'
                        style={{ float: 'right' }}>
                        {isLoading ? 'Updating...' : 'Update'}
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
        </div>

    );
};

export default UpdateWorkspace;