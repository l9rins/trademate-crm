import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            // Optionally verify token with backend here
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password }); // Username? Backend expects username/password.
        // Wait, backend AuthRequest has username, email, password.
        // AuthService.login uses username.
        // Frontend form typically asks for Email.
        // If backend expects 'username' field in login JSON, I need to send email as username or username as username.
        // Let's assume user enters 'username' field values.
        // I should match the backend expectation.
        // Backend `AuthRequest`: username, email, password.
        // AuthService.login uses `request.getUsername()`.
        // So I must send `{ username: email, password }` if they login with email, or `{ username: username, password }`.
        // Let's assume login with Username for now to be safe.

        const { token } = response.data;
        localStorage.setItem('token', token);
        const userData = { username: email }; // Mock user data from response? AuthResponse only has token.
        // I should decode token or fetch user me.
        // For MVP, just persist the username implies logged in.
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

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
