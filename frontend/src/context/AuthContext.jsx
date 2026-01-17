import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
// import jwtDecode from 'jwt-decode'; // Install if needed, for now just storing token

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage on boot
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            // Optional: Validate token validity here
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user: userData } = response.data; // Adjust based on actual response structure

        // Si el backend devuelve user dentro de data, adaptar aquí.
        // Revisando authController: res.json({ message, token }) -> No devuelve usuario explícito en login, 
        // pero el payload del token tiene id, username, role.
        // Para simplificar, guardamos el token y decodificamos si es necesario,
        // o hacemos una llamada a /profile. Por ahora simulamos user data si no viene.

        // TODO: Mejorar backend para devolver usuario en login o usar jwt-decode en frontend.
        // Asumimos que queremos mostrar algo, guardamos un objeto básico.
        const userObj = { email, ...userData };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));
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
