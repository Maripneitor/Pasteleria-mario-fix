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
                // Force redirect if token is invalid
                window.location.href = '/login';
            }
        } else {
            // If no token found, ensure user is null, consumer (ProtectedRoute) handles the rest usually, 
            // but user requested "redirect to /login immediately".
            // However, `token` might just be missing because user hasn't logged in yet on a public page?
            // Actually, the requirement says: "si el token en localStorage sigue siendo válido. Si no lo es, debe redirigir a '/login' inmediatamente".
            // If I'm on /login page, this might cause loop if handled poorly, but AuthContext mounts once.
            // Usually ProtectedRoute handles this. But let's follow instruction strictly for "invalid" tokens.
            // The loop risk exists if this runs on every page load including login.
            // Safe approach: Only redirect if token was present but invalid (handled above).
            // If token is simply missing, ProtectedRoutes handle it. 
            // BUT user said: "En 'AuthContext.jsx', verifica que al arrancar la app se valide si el token en localStorage sigue siendo válido. Si no lo es, debe redirigir a '/login' inmediatamente."
            // Assuming "Si no lo es" refers to validation failure.
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token } = response.data;

        if (!token) throw new Error("No token received");

        localStorage.setItem('token', token);
        const decoded = decodeToken(token);
        const userObj = { ...decoded, email, token };

        setUser(userObj);
        setUser(userObj);
        return userObj;
    };

    // --- DEBUG LOGIN FOR DEV ONLY ---
    const debugLogin = (role = 'Desarrollador') => {
        if (!import.meta.env.DEV) return;
        const mockToken = "DEBUG_TOKEN_" + Date.now();
        localStorage.setItem('token', mockToken);
        const userObj = {
            id: 9999,
            username: "Dev User",
            email: "dev@pasteleria.com",
            role: role,
            ownerId: null, // Root
            status: 'active',
            token: mockToken
        };
        setUser(userObj);
        window.location.reload(); // Reload to refresh all components
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, debugLogin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
