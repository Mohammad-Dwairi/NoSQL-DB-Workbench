import React from 'react';
import { Stack } from 'react-bootstrap';


const OperationsControl = props => {

    const { operation, onChange } = props;

    return (
        <Stack direction='horizontal' gap={2}>
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
        </Stack>
    );
};

export default OperationsControl;