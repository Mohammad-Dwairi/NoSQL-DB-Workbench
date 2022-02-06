import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Dropdown, FormControl, ListGroup, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SchemaOperationButton from '../components/home/SchemaOperationButton';
import AppModal from '../components/layout/AppModal';
import AppNavbar from '../components/layout/AppNavbar';
import AuthContext from '../store/auth-context';


const HomePage = props => {

    const authctx = useContext(AuthContext);

    const [schemas, setSchemas] = useState([]);
    const [showNewSchemaModal, setShowNewSchemaModal] = useState(false);
    const [showImportSchemaModal, setShowImportSchemaModal] = useState(false);
    const [schemaFile, setSchemaFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const newSchemaInputRef = useRef();

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

    const createSchemaHandler = async () => {
        const newSchemaName = newSchemaInputRef.current.value;
        if (newSchemaName.trim() === '') return;
        const url = `${authctx.databaseAddress}/db/ddl-write/schema`;
        const response = fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authctx.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'schemaName': newSchemaName })
        });

        if ((await response).ok) {
            setShowNewSchemaModal(false);
            newSchemaInputRef.current.value = ''
            schemasLoadingHandler();
        }
    };

    const dropSchemaHandler = async name => {
        const drop = window.confirm(`Drop (${name}), Are you sure?`);
        if (!drop) return;
        const url = `${authctx.databaseAddress}/db/ddl-write/schema/${name}`;
        console.log(schemaFile)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authctx.token}`,
            }
        });

        if (response.ok) {
            schemasLoadingHandler();
        }
    };

    const importSchemaHandler = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            setSchemaFile(text);
        };
        const file = e.target.files[0];
        if (file.size > 1024) return;
        reader.readAsText(e.target.files[0]);
    };

    const exportSchemaHandler = async schema => {
        const url = `${authctx.databaseAddress}/db/read/schema/${schema}/export`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authctx.token}`,
            }
        });

        const responseData = await response.blob();
        var downloadUrl = window.URL.createObjectURL(responseData);
        var a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${schema}_exported.json`;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
    };


    const submitSchemaFileHandler = async () => {
        const url = `${authctx.databaseAddress}/db/ddl-write/schema/import`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authctx.token}`,
                'Content-Type': 'application/json'
            },
            body: schemaFile
        });

        if (response.ok) {
            schemasLoadingHandler();
            setShowImportSchemaModal(false);
            setSchemaFile(null);
        }
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
            <AppModal
                heading='Create Schema'
                show={showNewSchemaModal}
                onHide={() => setShowNewSchemaModal(false)}
                onSave={createSchemaHandler}
            >
                <FormControl ref={newSchemaInputRef} placeholder="Schema Name" />
            </AppModal>
            <AppModal
                heading='Import Schema'
                show={showImportSchemaModal}
                onHide={() => setShowImportSchemaModal(false)}
                onSave={submitSchemaFileHandler}
            >
                <input className="form-control" type="file" onChange={importSchemaHandler} />
            </AppModal>

            <Row className='text-center d-flex justify-content-around'>
                <Col sm='5'>
                    <ListGroup>
                        <h2>Schemas</h2>
                        {
                            schemas.map((schema, index) => (
                                <Stack key={index} direction='horizontal' className='p-2 border border-1 d-flex justify-content-between'>
                                    <Link
                                        state={schema}
                                        to={`/schema/${schema}`}
                                        style={{ textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}
                                    >
                                        {schema}
                                    </Link>
                                    {authctx.role === 'ROLE_ADMIN' && <Dropdown>
                                        <Dropdown.Toggle variant="none" size='sm' />
                                        <Dropdown.Menu>
                                            <Dropdown.Item className='d-flex align-items-center' onClick={() => exportSchemaHandler(schema)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload text-success" viewBox="0 0 16 16">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                                                </svg>
                                                <span className='mx-2'>Export</span>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item className='d-flex  align-items-center' onClick={() => dropSchemaHandler(schema)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                                <span className='mx-2'>Drop</span>
                                            </Dropdown.Item>

                                        </Dropdown.Menu>
                                    </Dropdown>}
                                </Stack>
                            ))
                        }
                    </ListGroup>
                </Col>
                {authctx.role === 'ROLE_ADMIN' && <Col sm='4' className='bg-light d-flex align-items-center border rounded-3 p-5'>
                    <Stack gap={3} className='d-flex justify-content-center' >
                        <h3>Options</h3>

                        <Button size='sm' onClick={() => setShowNewSchemaModal(true)}>Create Schema</Button>
                        <Button size='sm' variant='secondary' onClick={() => setShowImportSchemaModal(true)}>Import Schema</Button>
                    </Stack>
                </Col>}
            </Row>
        </div>
    );
};

export default HomePage;