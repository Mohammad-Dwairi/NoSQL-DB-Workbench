import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import AuthContext from '../store/auth-context';
import { Button, Table } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';

const SchemaPage = props => {

    const history = useHistory();
    const { schema } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [indexes, setIndexes] = useState([]);

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
            const collection = collections[key]["collectionName"];
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

    useEffect(() => {
        loadCollectionsHandler();
    }, [schema]);

    const extractIndexesNames = (collection) => {
        const indexObj = indexes.find(idx => idx["collection"] === collection["collectionName"]);
        return indexObj.indexes;
    }

    if (isLoading) {
        return <h1>Loading... </h1>
    }

    return (
        <div>
            <AppNavbar />
            <h2 className='mb-4'>{schema} Schema</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>JSON Schema</th>
                        <th>Registered Indexes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        collections.map((collection, index) => (
                            <tr key={index}>
                                <td
                                    onClick={() => history.push({
                                        pathname: `/${schema}/${collection["collectionName"]}`,
                                        state: { indexes: extractIndexesNames(collection), collectionSchema: collection['collectionSchema'] }
                                    })}
                                    className='fw-bold text-primary'
                                    style={{ cursor: 'pointer' }}>
                                    {collection["collectionName"]}
                                </td>
                                <td><JSONPretty id="json-pretty" data={collection['collectionSchema']}></JSONPretty></td>
                                <td>
                                    {extractIndexesNames(collection).map((name, i) => <p key={i}>{i + 1} - {name}</p>)}
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