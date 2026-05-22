import React, { createContext, useContext, useMemo, useState } from 'react';
import api from '../../shared/lib/api';

const AuthContext = createContext(null);

const getStoredUser = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (!token || !savedUser) return null;

    try {
        return JSON.parse(savedUser);
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);

    const login = async (username, password) => {
        // Backend expects 'username' key in JSON.
        // Even if user enters email in the UI, we must map it to the 'username' field if we want AuthService to see it
        // (unless we change backend to look at email field).
        // Since Login.jsx asks for "Username", we pass it as 'username'.
        const response = await api.post('/auth/login', { username, password });

        const { token } = response.data;
        localStorage.setItem('token', token);
        const userData = { username };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return response.data;
    };

    const register = async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        const userData = { username, email };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        login,
        register,
        logout,
        loading: false,
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
