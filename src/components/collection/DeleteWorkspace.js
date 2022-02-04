import React, { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import QueryControl from './QueryControl';


const DeleteWorkspace = props => {


    const { schema, collection, indexes } = props;
    const [usedIndex, setUsedIndex] = useState('defaultId');
    const [status, setStatus] = useState({});
    const [error, setError] = useState(false);

    const searchValueRef = useRef();

    const authCtx = useContext(AuthContext);

    const deleteHandler = async () => {
        const searchValue = searchValueRef.current.value;
        if (searchValue.trim() === '') {
            return;
        }
        const query = usedIndex === 'defaultId' ? `/${searchValue}` : `?property=${usedIndex}&&value=${searchValue}`;
        const url = `${authCtx.databaseAddress}/db/dml-write/schema/${schema}/${collection}${query}`;

        const response = await fetch(url, {
            method: 'DELETE',
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

        setStatus({ 'status': 'OK' });
        setError(false);
    };

    return (
        <div className='mt-5'>
            <QueryControl
                indexChangeHandler={event => setUsedIndex(event.target.value)}
                valueInputRef={searchValueRef}
                onExecute={deleteHandler}
                indexes={indexes}
                buttonLabel='Delete'
            />
            <div className='p-3'>
                {<p className={error ? 'text-danger' : 'text-success'}>{Object.keys(status).length !== 0 && JSON.stringify(status)}</p>}
            </div>
        </div>
    );
};

export default DeleteWorkspace;