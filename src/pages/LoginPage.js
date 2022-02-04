import React from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import LoginForm from '../components/login/LoginForm';

const LoginPage = props => {

    return (
        <Container style={styles.container}>
            <div style={styles.form} className='p-5'>
                <h2>NoSQL Database Workbench</h2>
                <h3 className='mb-4'>Login</h3>
                <Tabs
                    defaultActiveKey="Master Connection"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="Master Connection" title="Master Connection">
                        <LoginForm master/>
                    </Tab>
                    <Tab eventKey="Read-Only Connection" title="Read-Only Connection">
                        <p className='text-danger'>Read-Only connections will redirect you to one of the active load-balancing nodes.</p>
                        <LoginForm />
                    </Tab>
                </Tabs>

            </div>
        </Container>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        marginTop: "200px"
    },
    form: {
        width: "800px"
    }

}

export default LoginPage;