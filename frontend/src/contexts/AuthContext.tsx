import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterData } from '@/types';
import api from '@/services/api/client';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    register: (data: RegisterData) => Promise<void>;
    // switchBranch: (branchId: number) => void; // Removed for now if not in original logic, or add back if needed
    hasPermission: (permission: string) => boolean;
    debugLogin?: () => void; // Solo desarrollo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        currentBranch: null,
        availableBranches: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token validity
                    const decoded: any = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        throw new Error('Token expired');
                    }

                    // Fetch user data
                    const response = await api.get('/auth/me');
                    setAuthState(prev => ({
                        ...prev,
                        user: response.data,
                        token,
                        loading: false
                    }));
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    logout();
                }
            } else {
                setAuthState(prev => ({ ...prev, loading: false }));
            }
        };
        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setAuthState(prev => ({
                ...prev,
                user,
                token,
                error: null
            }));
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Error al iniciar sesión'
            }));
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await api.post('/auth/register', data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setAuthState(prev => ({
                ...prev,
                user,
                token,
                error: null
            }));
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Error al registrarse'
            }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            user: null,
            token: null,
            currentBranch: null,
            availableBranches: [],
            loading: false,
            error: null
        });
    };

    const hasPermission = (permission: string): boolean => {
        if (!authState.user) return false;
        // Implement specific logic based on user.role or user.permissions
        if (authState.user.role === 'Desarrollador' || authState.user.role === 'Administrador' || authState.user.role === 'Dueño') return true;

        return authState.user.permissions?.[permission] || false;
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        register,
        // switchBranch, 
        hasPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
