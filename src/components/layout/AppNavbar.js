import React, { useContext } from 'react';
import { Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const AppNavbar = props => {
    
    const authCtx = useContext(AuthContext);

    return (
        <Navbar bg="dark" variant="dark" className='mb-5'>
            <Container>
                <Navbar.Brand>NoSQL Database Workbench</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Text className='text-light' style={{fontSize: '14px'}}>Connected To: {authCtx.databaseAddress}</Navbar.Text>
                <NavDropdown title={'Logged in: ' + authCtx.username}>
                    <NavDropdown.Item href="#action/3.2">Security</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.4">Manage Users</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => authCtx.logout()}>Logout</NavDropdown.Item>

                </NavDropdown>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;