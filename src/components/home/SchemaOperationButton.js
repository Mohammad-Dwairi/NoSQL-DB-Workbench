import React from 'react';
import { Stack } from 'react-bootstrap';


const SchemaOperationButton = props => {

    const { onClick, title, icon } = props;
    return (
        <Stack direction='horizontal' gap={3} style={{ cursor: 'pointer' }} onClick={onClick}>
            {title}
        </Stack>
    );
};

export default SchemaOperationButton;