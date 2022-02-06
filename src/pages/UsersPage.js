import React, { useContext, useEffect, useRef, useState } from 'react';
import { Accordion, Button, ButtonGroup, Col, FormControl, Stack } from 'react-bootstrap';
import AppModal from '../components/layout/AppModal';
import AppNavbar from '../components/layout/AppNavbar';
import AuthContext from '../store/auth-context';


const UsersPage = props => {


    const [users, setUsers] = useState([]);
    const [error, setError] = useState({});
    const authCtx = useContext(AuthContext);

    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_ADMIN');

    const oldPassInputRef = useRef();
    const newPassInputRef = useRef();

    const loadUsers = async () => {
        const response = await fetch(`${authCtx.databaseAddress}/db/users`, {
            headers: {
                'Authorization': `Bearer ${authCtx.token}`
            }
        });
        const responseData = await response.json();
        if (response.ok) {
            setUsers(responseData);
        }
        else {
            setError(responseData);
        }
    };

    const registerUser = async () => {
        if (username.trim() === '' || password.trim() === '') return;
        const response = await fetch(`${authCtx.databaseAddress}/db/users/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password, role: role })
        });

        if (response.ok) {
            setUsername('');
            setPassword('');
            setShowRegistrationModal(false);
            loadUsers();
        }
        else {
            const error = await response.json();
            alert('Something went wrong! ' + error.message);
        }
    };

    const deleteUserHandler = async (username) => {
        const remove = window.confirm(`Delete user ${username}?`);
        if (!remove) return;
        const response = await fetch(`${authCtx.databaseAddress}/db/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`
            }
        });

        if (response.ok) {
            loadUsers();
        }
        else {
            const error = await response.json();
            alert('Something went wrong! ' + error.message);
        }
    };

    const updatePasswordHandler = async (username) => {
        const oldPassword = oldPassInputRef.current.value;
        const newPassword = newPassInputRef.current.value;
        console.log(oldPassword, " ," , newPassword, " ," , username)
        if (oldPassword.trim() === '' || newPassword.trim() === '') return;
        const response = await fetch(`${authCtx.databaseAddress}/db/users/${username}/password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
        });

        if (response.ok) {
            oldPassInputRef.current.value = '';
            newPassInputRef.current.value = '';
            setShowUpdatePasswordModal(false);
        }
        else {
            const error = await response.json();
            alert('Something went wrong. ' + error['message']);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);


    return (
        <div className='text-center'>
            <AppNavbar />
            <AppModal
                size='md'
                heading='Register New User'
                show={showRegistrationModal}
                onHide={() => setShowRegistrationModal(false)}
                onSave={registerUser}
            >
                <h6>Username</h6>
                <FormControl value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />

                <h6 className='mt-3'>Password</h6>
                <FormControl value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type='password' />

                <h6 className='mt-3'>Role</h6>
                <select className="form-select" onChange={e => setRole(e.target.value)}>
                    <option value='ROLE_ADMIN' >Admin</option>
                    <option value='ROLE_USER'>User</option>
                </select>
            </AppModal>

            <Button className='mb-4' onClick={() => setShowRegistrationModal(true)}>Register New User</Button>
            <div className='d-flex flex-column  p-5 bg-light shadow'>
                <Accordion >
                    <h1>Users</h1>
                    {users.map((user, index) => (
                        <div key={index}>
                            <AppModal
                                size='md'
                                heading={`Update ${user.username}'s Password`}
                                show={showUpdatePasswordModal}
                                onHide={() => setShowUpdatePasswordModal(false)}
                                onSave={() => updatePasswordHandler(user.username)}
                            >
                                <h6>Current Password</h6>
                                <FormControl ref={oldPassInputRef} type='password' />

                                <h6 className='mt-3'>New Password</h6>
                                <FormControl ref={newPassInputRef} type='password' />
                            </AppModal>
                            <Accordion.Item eventKey={index}>
                                <Accordion.Header>
                                    <Col>
                                        <span className='mx-3'>{user.username}</span>
                                    </Col>
                                    <Col>
                                        <span className={user.role === 'ROLE_ADMIN' ? 'text-danger' : 'text-primary'}>({user.role})</span>
                                    </Col>
                                </Accordion.Header>
                                <Accordion.Body className='d-flex justify-content-center flex-column'>
                                    <Stack gap={2} className='w-50 align-self-center'>
                                        <Button variant="secondary" size='sm' onClick={() => setShowUpdatePasswordModal(true)}>Update Password</Button>
                                        {authCtx.username !== user.username && <Button variant="secondary" size='sm' onClick={() => deleteUserHandler(user.username)}>Delete User</Button>}
                                    </Stack>
                                </Accordion.Body>
                            </Accordion.Item>
                        </div>

                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default UsersPage;