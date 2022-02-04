import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/layout/AppNavbar';
import AuthContext from '../store/auth-context';


const HomePage = props => {

    const authctx = useContext(AuthContext);
    const [schemas, setSchemas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const schemasLoadingHandler = async () => {
        setIsLoading(true);

        const url = `${authctx.databaseAddress}/db/read/schema`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authctx.token}`
            }
        });

        const responseData = await response.json();
        const schemaList = responseData.map(s => s.name);

        if (!response.ok) {
            authctx.logout();
        }

        setSchemas(schemaList);
        setIsLoading(false);
    };

    useEffect(() => {
        schemasLoadingHandler();
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <AppNavbar />
            <div className='d-flex flex-column bg-light p-5 align-items-center rounded'>

                <ListGroup style={{ width: '500px' }}>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h2>Schemas</h2>
                        <span>
                            Create new schema
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-2 bi bi-plus-square text-success" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                        </span>
                    </div>
                    {
                        schemas.map((schema, index) => (
                            <Row>
                                <Link
                                    state={schema}
                                    key={index}
                                    to={`/schema/${schema}`}
                                    className='border p-2'
                                    style={{ textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}
                                >
                                    {schema}
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                            </Row>

                        ))
                    }
                </ListGroup>
            </div>
        </div>
    );
};

export default HomePage;