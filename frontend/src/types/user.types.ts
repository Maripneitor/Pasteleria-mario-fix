export type UserRole = 'Desarrollador' | 'Administrador' | 'Dueño' | 'Vendedor' | 'Empleado';
export type UserStatus = 'active' | 'pending_verification' | 'banned' | 'inactive';

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    ownerId?: number | null;
    branchId?: number | null;
    permissions?: Record<string, boolean>;
    dashboardConfig?: {
        disabledTabs?: string[];
        theme?: 'light' | 'dark';
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Branch {
    id: number;
    name: string;
    address?: string;
    phone?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    currentBranch: Branch | null;
    availableBranches: Branch[];
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    username: string;
    role: UserRole;
    branchId?: number;
}
