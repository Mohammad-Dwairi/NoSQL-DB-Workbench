import React from 'react';
import { Stack } from 'react-bootstrap';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en'


const DocumentInput = props => {

    const { onInsert, returnedValue } = props;

    return (
        <Stack gap={2}>
            <JSONInput
                onChange={onInsert}
                id='a_unique_id'
                locale={locale}
                height='400px'
                width='auto'
                style={{ container: { borderRadius: "10px" }, contentBox: { fontSize: "13px" } }}
            />
            <JSONInput
                viewOnly
                placeholder={returnedValue}
                theme='light_mitsuketa_tribute'
                locale={locale}
                height='150px'
                width='auto'
                style={{ container: { borderRadius: "10px" }, contentBox: { fontSize: "13px" } }}
            />
        </Stack>
    );
};

export default DocumentInput;