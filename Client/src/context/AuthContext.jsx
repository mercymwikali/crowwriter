import React, { createContext, useContext, useEffect, useState } from 'react';
//create message board where we'll post the authentication message
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
//defining the context data
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [role, setRole]=useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
        const storedData = JSON.parse(localStorage.getItem('user_data'));
    useEffect(() => {
        if (storedData) {
            const { userToken, user,role } = storedData;
            setToken(userToken);
            setRole(role);
            setUserData(user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken, newData, newRole) => {
        localStorage.setItem(
            'user_data',
            JSON.stringify({ userToken: newToken, user: newData})
        );

        setToken(newToken);
        setUserData(newData);
        setRole(newrole);
        setIsAuthenticated(true);
    };


    const logout = () => {
        localStorage.removeItem('user_data');
        setToken(null);
        setUserData(null);
        setRole(null);
        setIsAuthenticated(false);
    };
    

    return (
        //providing the context data we want to share to higher-level-component(HOC)

        <AuthContext.Provider value={{ token, isAuthenticated, role, login, logout, userData }}>
            {children}
        </AuthContext.Provider>
    )
}
//simplifying the process of consuming the data by use of UseContext hook
export const useAuth = () => useContext(AuthContext);