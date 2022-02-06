import React, { useContext, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';

import { useHistory, useLocation, useParams } from 'react-router-dom';
import DeleteWorkspace from '../components/collection/DeleteWorkspace';
import DropCollectionWorkspace from '../components/collection/DropCollectionWorkspace';
import IndexWorkspace from '../components/collection/IndexWorkspace';
import InsertWorkspace from '../components/collection/InsertWorkspace';
import OperationsControl from '../components/collection/OperationsControl';
import ReadWorkspace from '../components/collection/ReadWorkspace';
import UpdateWorkspace from '../components/collection/UpdateWorkspace';
import AppBreadCrumb from '../components/layout/AppBreadCrumb';
import AppNavbar from '../components/layout/AppNavbar';

const CollectionPage = props => {

    const { indexes, collectionSchema } = useLocation().state;


    const { schema, collection } = useParams();
    const [operation, setOperation] = useState('read');

    const [activeIndexes, setActiveIndexes] = useState(indexes);


    const handleOperationChange = (event) => {
        setOperation(event.target.value);
    };

    const renderWorkspace = () => {
        switch (operation) {
            case 'read':
                return <ReadWorkspace schema={schema} collection={collection} indexes={activeIndexes} />;
            case 'insert':
                return <InsertWorkspace
                    schema={schema}
                    collection={collection}
                    collectionSchema={collectionSchema}
                />;
            case 'update':
                return <UpdateWorkspace
                    schema={schema}
                    collection={collection}
                    collectionSchema={collectionSchema}
                    indexes={activeIndexes}
                />;
            case 'delete':
                return <DeleteWorkspace
                    schema={schema}
                    collection={collection}
                    collectionSchema={collectionSchema}
                    indexes={activeIndexes}
                />;
            case 'index':
                return <IndexWorkspace
                    collectionSchema={collectionSchema}
                    schema={schema}
                    collection={collection}
                    indexes={activeIndexes}
                    setIndexes={setActiveIndexes}
                />;
            case 'drop':
                return <DropCollectionWorkspace
                    schema={schema}
                    collection={collection}
                />;
            default:
                return null;
        }
    };

    return (
        <div>
            <AppNavbar />
            <Row>
                <Col>
                    <AppBreadCrumb values={['NoSQL Database', schema, collection, operation]} />
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item className='d-flex  align-self-center' onClick={() => { }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                                <span className='mx-2'>Drop</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <OperationsControl
                operation={operation}
                onChange={handleOperationChange}
            />
            {renderWorkspace()}

        </div>
    );
};

export default CollectionPage;