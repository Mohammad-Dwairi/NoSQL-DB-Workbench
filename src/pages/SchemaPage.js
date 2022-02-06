import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import AuthContext from '../store/auth-context';
import { Button, FormControl, Stack, Table } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import AppModal from '../components/layout/AppModal';
import JSONInput from 'react-json-editor-ajrm';
import DocumentInput from '../components/collection/DocumentInput';

const SchemaPage = props => {

    const history = useHistory();

    const { schema } = useParams();

    const newCollectionNameInputRef = useRef();
    const [newCollectionSchema, setNewCollectionSchema] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [indexes, setIndexes] = useState([]);
    const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
    const [newCollectionResponse, setNewCollectionResponse] = useState({});

    const authCtx = useContext(AuthContext);

    const loadCollectionsHandler = async () => {
        setIsLoading(true);
        const collectionsResponse = await fetch(`${authCtx.databaseAddress}/db/read/schema/${schema}/collections`, {
            headers: {
                "Authorization": `Bearer ${authCtx.token}`
            }
        });

        const collections = await collectionsResponse.json();
        if (!collectionsResponse.ok) {
            history.replace('/not-found');
            return;
        }

        const indexesList = [];

        for (let key in Object.keys(collections)) {
            const collection = collections[key]["name"];
            const indexesResponse = await fetch(`${authCtx.databaseAddress}/db/read/schema/${schema}/${collection}/indexes`, {
                headers: {
                    "Authorization": `Bearer ${authCtx.token}`
                }
            });

            const indexesData = await indexesResponse.json();
            indexesList.push({ collection: collection, indexes: indexesData });
        }

        setCollections(collections);
        setIndexes(indexesList);
        setIsLoading(false);
    };

    const createCollectionHandler = async () => {
        console.log(newCollectionSchema);
        const collectionName = newCollectionNameInputRef.current.value;
        if (collectionName.trim() === '' || Object.keys(newCollectionSchema).length === 0) return;

        const url = `${authCtx.databaseAddress}/db/ddl-write/schema/${schema}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: collectionName, schema: newCollectionSchema?.jsObject })
        });

        if (response.ok) {
            newCollectionNameInputRef.current.value = '';
            setNewCollectionResponse({ 'status': 'OK' });
            setShowNewCollectionModal(false);
            setNewCollectionSchema({});
            loadCollectionsHandler();
        }
        else {
            setNewCollectionResponse(await response.json());
        }
    };

    useEffect(() => {
        loadCollectionsHandler();
    }, [schema]);

    const extractIndexesNames = (collection) => {
        const indexObj = indexes.find(idx => idx["collection"] === collection["name"]);
        return indexObj.indexes;
    }

    if (isLoading) {
        return <h1>Loading... </h1>
    }

    return (
        <div>
            <AppNavbar />

            <AppModal
                size='lg'
                heading='Add New Collection'
                show={showNewCollectionModal}
                onHide={() => setShowNewCollectionModal(false)}
                onSave={createCollectionHandler}
            >
                <h6>Collection Name</h6>
                <FormControl ref={newCollectionNameInputRef} placeholder="Collection Name" />
                <h6 className='mt-3'>Collection JSON Schema</h6>
                <DocumentInput onInsert={setNewCollectionSchema} returnedValue={newCollectionResponse} />
            </AppModal>

            <Stack direction='horizontal' className='d-flex justify-content-between'>
                <h2 className='mb-4 fs-5'><span className='text-primary fs-2'>{schema}</span> Schema</h2>
                {authCtx.role === 'ROLE_ADMIN' && <Button size='sm' onClick={() => setShowNewCollectionModal(true)}>Add New Collection</Button>}
            </Stack>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Registered Indexes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        collections.map((collection, index) => (
                            <tr key={index}>
                                <td
                                    onClick={() => history.push({
                                        pathname: `/${schema}/${collection["name"]}`,
                                        state: { indexes: extractIndexesNames(collection), collectionSchema: collection['schema'] }
                                    })}
                                    className='fw-bold text-primary'
                                    style={{ cursor: 'pointer' }}>
                                    {collection["name"]}
                                </td>
                                <td>
                                    {extractIndexesNames(collection).map((name, i) => <div key={i}>{i + 1} - {name}</div>)}
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </Table>
        </div>

    );
};

export default SchemaPage;