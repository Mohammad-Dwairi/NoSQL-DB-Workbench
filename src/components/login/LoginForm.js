import { useContext, useRef, useState } from "react";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";


const LoginForm = props => {

    const hostRef = useRef();
    const portRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const { master } = props;

    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const submitHandler = async () => {

        const hostIP = hostRef.current.value;
        const port = portRef.current.value

        const url = `http://${hostIP}:${port}`;

        if (!!!hostIP && !!!port) {
            return;
        }

        setIsLoading(true);

        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': usernameRef.current.value,
                'password': passwordRef.current.value
            })
        }).catch(e => {
            setHasError(true);
            setErrorMsg('Error')
            return;
        });

        const responseData = await response.json();

        if (!response.ok) {
            setHasError(true);
            setErrorMsg(responseData['message']);
            return;
        }

        if (master) {
            authCtx.login(responseData['accessToken'], responseData['username'], responseData['role'], url);
            setIsLoading(false);
            history.replace('/home');
        }
        else {
            const replicaConnection = await fetch(`${url}/db/replica`, {
                headers: {
                    'Authorization': `Bearer ${responseData['accessToken']}`
                }
            });

            if (replicaConnection.ok) {
                const connection = await replicaConnection.text();
                authCtx.login(responseData['accessToken'], responseData['username'], responseData['role'], connection);
                setIsLoading(false);
                history.replace('/home');
            }
            else {
                const errorRes = await replicaConnection.json();
                setHasError(true);
                setErrorMsg(errorRes['message']);
            }
        }
    };

    return (
        <Form>
            {hasError && <Alert variant='danger'>{errorMsg}</Alert>}
            <Form.Group as={Row} className="mb-3">
                <Col sm="8">
                    <Form.Label>
                        {master ? 'Database IP' : 'Master IP'}
                    </Form.Label>
                    <Form.Control ref={hostRef} required />
                </Col>
                <Col sm="4">
                    <Form.Label>
                        {master ? 'Database Port' : 'Master Port'}
                    </Form.Label>
                    <Form.Control ref={portRef} required />
                </Col>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>
                    Username
                </Form.Label>
                <Form.Control ref={usernameRef} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>
                    Password
                </Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Button variant="primary" style={{ float: "right", width: "150px" }} onClick={submitHandler}>{isLoading ? 'Connecting...' : 'Connect'}</Button>
        </Form>
    );
}

export default LoginForm;