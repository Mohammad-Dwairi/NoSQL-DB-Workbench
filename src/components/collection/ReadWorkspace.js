import React, { useContext, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import AuthContext from '../../store/auth-context';
import QueryControl from './QueryControl';

const ReadWorkspace = props => {

    const { schema, collection, indexes } = props;

    const [searchResult, setSearchResult] = useState([]);
    const [usedIndex, setUsedIndex] = useState('defaultId');

    const authCtx = useContext(AuthContext);

    const searchValueRef = useRef();

    const searchHandler = async () => {
        const searchValue = searchValueRef.current.value;
        let query = ''
        if (searchValue.trim() !== '') {
            query = usedIndex === 'defaultId' ? `/${searchValue}` : `?property=${usedIndex}&&value=${searchValue}`;
        }
        const url = `${authCtx.databaseAddress}/db/read/schema/${schema}/${collection}${query}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authCtx.token}`
            }
        });

        const responseData = await response.json();

        setSearchResult(responseData);
    };


    return (
        <div className='mt-5'>
            <QueryControl
                indexChangeHandler={event => setUsedIndex(event.target.value)}
                valueInputRef={searchValueRef}
                onExecute={searchHandler}
                indexes={indexes}
                buttonLabel='Search'
            />
            <Row className='p-3 shadow rounded' style={{ backgroundColor: '#272822', height: "600px", overflowY: "scroll" }}>
                <JSONPretty id="json-pretty" data={searchResult}></JSONPretty>
            </Row>
        </div>

    );
};

export default ReadWorkspace;