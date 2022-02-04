import React, { useContext, useState } from 'react';
import JSONPretty from 'react-json-pretty';

import { useLocation, useParams } from 'react-router-dom';
import DeleteWorkspace from '../components/collection/DeleteWorkspace';
import IndexWorkspace from '../components/collection/IndexWorkspace';
import InsertWorkspace from '../components/collection/InsertWorkspace';
import OperationsControl from '../components/collection/OperationsControl';
import ReadWorkspace from '../components/collection/ReadWorkspace';
import UpdateWorkspace from '../components/collection/UpdateWorkspace';
import AppBreadCrumb from '../components/layout/AppBreadCrumb';
import AppNavbar from '../components/layout/AppNavbar';

const CollectionPage = props => {

    const { schema, collection } = useParams();
    const [operation, setOperation] = useState('');

    const { indexes, collectionSchema } = useLocation().state;

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
            default: return null;
        }
    };

    return (
        <div>
            <AppNavbar />
            <AppBreadCrumb values={['NoSQL Database', schema, collection, operation]} />
            <OperationsControl
                operation={operation}
                onChange={handleOperationChange}
            />
            {renderWorkspace()}

        </div>
    );
};

export default CollectionPage;