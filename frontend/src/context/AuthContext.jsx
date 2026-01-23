import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [availableBranches, setAvailableBranches] = useState([]);
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
        // Inicializar estado desde localStorage
        const token = localStorage.getItem('token');
        const storedBranchId = localStorage.getItem('branch_id');
        const storedPermissions = localStorage.getItem('permissions');
        const storedUser = localStorage.getItem('user_data');
        const storedBranches = localStorage.getItem('available_branches');

        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                // Restaurar usuario
                if (storedUser) setUser(JSON.parse(storedUser));

                // Restaurar permisos
                if (storedPermissions) setUserPermissions(JSON.parse(storedPermissions));

                // Restaurar ramas disponibles
                let branches = [];
                if (storedBranches) {
                    branches = JSON.parse(storedBranches);
                    setAvailableBranches(branches);
                }

                // Restaurar rama activa
                if (storedBranchId && branches.length > 0) {
                    const activeBranch = branches.find(b => String(b.id) === String(storedBranchId));
                    if (activeBranch) setCurrentBranch(activeBranch);
                } else if (branches.length > 0) {
                    // Fallback a la primera si no hay seleccionada persistida
                    setCurrentBranch(branches[0]);
                    localStorage.setItem('branch_id', branches[0].id);
                }

                // Configurar header por defecto
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn("Token expirado o inválido al iniciar. Logout.");
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            // Estructura esperada de respuesta:
            // { token, user, permissions, branches, defaultBranch }
            const { token, user, permissions, branches, defaultBranch } = response.data;

            if (!token) throw new Error("No token received");

            // 1. Guardar Token
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 2. Guardar Usuario
            localStorage.setItem('user_data', JSON.stringify(user));
            setUser(user);

            // 3. Guardar Permisos
            localStorage.setItem('permissions', JSON.stringify(permissions || []));
            setUserPermissions(permissions || []);

            // 4. Guardar Ramas y Rama por Defecto
            const validBranches = branches || [];
            localStorage.setItem('available_branches', JSON.stringify(validBranches));
            setAvailableBranches(validBranches);

            // Determinar rama inicial
            const initialBranch = defaultBranch || validBranches[0];
            if (initialBranch) {
                localStorage.setItem('branch_id', initialBranch.id);
                localStorage.setItem('current_branch_id', initialBranch.id);
                setCurrentBranch(initialBranch);
            }

            return user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const switchBranch = (branchId) => {
        const selected = availableBranches.find(b => b.id === parseInt(branchId));
        if (selected) {
            setCurrentBranch(selected);
            localStorage.setItem('branch_id', selected.id); // Mantener legacy por compatibilidad
            localStorage.setItem('current_branch_id', selected.id);

            // OPCIONAL: Notificar al usuario o simplemente dejar que los useEffect 
            // de Clients.jsx y Folios.jsx reaccionen al cambio de estado.
            console.log(`Cambiando a sucursal: ${selected.name}`);
        } else {
            console.error("Sucursal no encontrada");
        }
    };

    const logout = () => {
        console.log("Ejecutando logout...");
        localStorage.removeItem('token');
        localStorage.removeItem('branch_id');
        localStorage.removeItem('permissions');
        localStorage.removeItem('user_data');
        localStorage.removeItem('available_branches');

        setUser(null);
        setCurrentBranch(null);
        setUserPermissions([]);
        setAvailableBranches([]);

        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
    };

    // Función auxiliar para verificar permisos en la UI
    const hasPermission = (permissionRequired) => {
        if (!permissionRequired) return true;
        return userPermissions.includes(permissionRequired);
    };

    // Helper para etiqueta amigable de rol (basado en permisos o rol legacy)
    const getUserRoleLabel = () => {
        if (userPermissions.includes('admin.access')) return 'Administrador Global';
        if (userPermissions.includes('owners.manage')) return 'Dueño de Franquicia';
        if (userPermissions.includes('production.view')) return 'Equipo de Cocina';
        if (userPermissions.includes('folios.create')) return 'Vendedor de Sucursal';

        // Fallback a rol legacy si existe
        if (user?.role) return user.role;

        return 'Usuario';
    };

    return (
        <AuthContext.Provider value={{
            user,
            currentBranch,
            userPermissions,
            availableBranches,
            loading,
            login,
            logout,
            switchBranch,
            hasPermission,
            getUserRoleLabel
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
