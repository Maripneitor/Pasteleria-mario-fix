import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Decode token helper
    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (e) {
            console.error("Invalid token", e);
            return null;
        }
    };

    useEffect(() => {
        // Check local storage on boot
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                // If token is valid, we set the user. 
                // We trust the token's payload for role/username.
                setUser({ ...decoded, token });
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token } = response.data;

        if (!token) throw new Error("No token received");

        localStorage.setItem('token', token);
        const decoded = decodeToken(token);
        const userObj = { ...decoded, email, token }; // Ensure email is available if not in token

        setUser(userObj);
        return userObj;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
