import React, { useContext } from 'react';
import { Stack } from 'react-bootstrap';
import AuthContext from '../../store/auth-context';


const OperationsControl = props => {

    const { operation, onChange } = props;
    const authCtx = useContext(AuthContext);

    return (
        <Stack direction='horizontal' gap={2} className='mt-5'>
            <input
                value='read'
                checked={operation === 'read'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="read"
            />
            <label
                className={'w-100 btn ' + (operation === 'read' ? 'btn-primary' : 'btn-secondary')}
                htmlFor="read">
                Read
            </label>

            <input
                value='insert'
                checked={operation === 'insert'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="insert"
            />
            <label
                className={'w-100 btn ' + (operation === 'insert' ? 'btn-primary' : 'btn-secondary')}
                htmlFor="insert">
                Insert
            </label>

            <input
                value='update'
                checked={operation === 'update'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="update" />
            <label
                className={'w-100 btn ' + (operation === 'update' ? 'btn-primary' : 'btn-secondary')}
                htmlFor="update">
                Update
            </label>

            <input
                value='delete'
                checked={operation === 'delete'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="delete" />
            <label
                className={'w-100 btn ' + (operation === 'delete' ? 'btn-primary' : 'btn-secondary')}
                htmlFor="delete">
                Delete
            </label>
            <input
                value='index'
                checked={operation === 'index'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="index" />
            <label
                className={'w-100 btn ' + (operation === 'index' ? 'btn-primary' : 'btn-secondary')}
                htmlFor="index">
                Index
            </label>
            {authCtx.role === 'ROLE_ADMIN' && <input
                value='drop'
                checked={operation === 'drop'}
                onChange={onChange}
                type="radio"
                className="btn-check"
                name="operations"
                id="drop" />}
           {authCtx.role === 'ROLE_ADMIN' && <label
                className={'w-100 btn ' + (operation === 'drop' ? 'btn-danger' : 'btn-secondary')}
                htmlFor="drop">
                Drop Collection
            </label>}
        </Stack>
    );
};

export default OperationsControl;