import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    username: '',
    databaseAddress: '',
    isLoggedIn: false,
    login: (token, username, databaseAddress) => { },
    logout: () => { }
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [databaseAddress, setDatabaseAddress] = useState(localStorage.getItem('databaseAddress'));
    const isLoggedIn = !!token;

    const loginHandler = (token, username, databaseAddress) => {
        setToken(token);
        setUsername(username);
        setDatabaseAddress(databaseAddress);
        localStorage.setItem("token", token);
        localStorage.setItem('username', username);
        localStorage.setItem('databaseAddress', databaseAddress);
    };

    const logoutHandler = () => {
        setToken(null);
        setUsername(null);
        setDatabaseAddress(null);
        localStorage.clear();
    };

    const contextValue = {
        token: token,
        username: username,
        databaseAddress: databaseAddress,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext