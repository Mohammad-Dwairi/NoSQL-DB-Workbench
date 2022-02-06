import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    username: '',
    databaseAddress: '',
    role: '',
    isLoggedIn: false,
    login: (token, username, role, databaseAddress) => { },
    logout: () => { }
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [databaseAddress, setDatabaseAddress] = useState(localStorage.getItem('databaseAddress'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const isLoggedIn = !!token;

    const loginHandler = (token, username, role, databaseAddress) => {
        setToken(token);
        setUsername(username);
        setRole(role);
        setDatabaseAddress(databaseAddress);
        localStorage.setItem("token", token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('databaseAddress', databaseAddress);
    };

    const logoutHandler = () => {
        setToken(null);
        setUsername(null);
        setRole(null);
        setDatabaseAddress(null);
        localStorage.clear();
    };

    const contextValue = {
        token: token,
        username: username,
        role: role,
        databaseAddress: databaseAddress,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext