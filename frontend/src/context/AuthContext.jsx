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
                // Ensure we reconstruct a user object similar to login response if possible, 
                // or just minimum needed from token.
                setUser({ ...decoded, token });
                // Set default axios header just in case it wasn't set
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn("Token invalid on boot, forcing logout.");
                logout(); // Use the robust logout function
            }
        }
        // Note: No else block needed to redirect if no token, ProtectedRoute handles that.
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        // Backend now returns { user: {...}, token }
        // Fallback to old structure just in case backend isn't deployed yet 
        const token = response.data.token;
        const userData = response.data.user || decodeToken(token); // Fallback to decode if user obj missing

        if (!token) throw new Error("No token received");

        localStorage.setItem('token', token);

        // Persist minimal user info if needed, but for now we rely on AuthContext state
        // and token decoding on refresh. 
        // Actually, let's keep it simple: Token is the source of truth for persistence.

        // Set global header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Construct final user object matching what we want in state
        const userObj = { ...userData, token };
        setUser(userObj);

        return userObj;
    };

    // --- DEBUG LOGIN FOR DEV ONLY ---
    const debugLogin = (role = 'Desarrollador') => {
        if (!import.meta.env.DEV) return;
        const mockToken = "DEBUG_TOKEN_" + Date.now(); // This won't work with real backend middleware
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
        window.location.reload();
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    /**
     * Logout robusto:
     * 1. Limpia localStorage
     * 2. Limpia estado React
     * 3. Limpia headers Axios
     * 4. Redirección imperativa
     */
    const logout = () => {
        console.log("Ejecutando logout robusto...");
        // a) Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // b) Settear 'user' a null
        setUser(null);

        // c) Eliminar headers de Authorization en Axios
        delete api.defaults.headers.common['Authorization'];

        // d) window.location.href = '/login' (para purgar el árbol de componentes)
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, debugLogin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
