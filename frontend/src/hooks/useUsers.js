import { useState, useEffect, useCallback } from 'react';

// Mock Initial Data
const INITIAL_USERS = [
    { id: 1, username: 'MarioDueño', email: 'mario@pasteleria.com', role: 'Dueño', status: 'active', avatar: 'M' },
    { id: 2, username: 'JuanEmpleado', email: 'juan@demo.com', role: 'Empleado', status: 'active', avatar: 'J' },
    { id: 3, username: 'AnaVentas', email: 'ana@demo.com', role: 'Empleado', status: 'pending', avatar: 'A' },
    { id: 4, username: 'DevAdmin', email: 'dev@sys.com', role: 'Administrador', status: 'active', avatar: 'D' },
];

export const useUsers = () => {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simulate API Fetch
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
            setUsers(prev => [...prev]); // Just return current state for now as it's in-memory mock
        } catch (err) {
            setError('Error al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Simulate API Create
    const createUser = async (userData) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            const newUser = {
                id: Date.now(),
                ...userData,
                avatar: userData.username.charAt(0).toUpperCase(),
                status: 'active' // Default status
            };
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            setError('Error al crear usuario');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate API Update
    const updateUser = async (id, updates) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
        } catch (err) {
            setError('Error al actualizar usuario');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate API Delete
    const deleteUser = async (id) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError('Error al eliminar usuario');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser
    };
};
