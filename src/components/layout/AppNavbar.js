import React, { useContext } from 'react';
import { Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const AppNavbar = props => {

    const authCtx = useContext(AuthContext);

    const history = useHistory();

    return (
        <Navbar bg="dark" variant="dark" className='mb-5 px-3 d-flex justify-content-between'>
            <Navbar.Brand>
                <div>NoSQL Database Workbench</div>
                <div className='text-success' style={{ fontSize: '13px' }}>Connected To: {authCtx.databaseAddress}</div>
            </Navbar.Brand>

            <NavDropdown title={'Logged in: ' + authCtx.username}>
                {authCtx.role === 'ROLE_ADMIN' && <NavDropdown.Item onClick={() => history.push('/users')}>Manage Users</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => authCtx.logout()}>Logout</NavDropdown.Item>
            </NavDropdown>
        </Navbar>
    );
};

export default AppNavbar;