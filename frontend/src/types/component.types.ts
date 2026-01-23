import { ReactNode } from 'react';
import { UserRole } from './user.types';

export interface ProtectedRouteProps {
    children?: ReactNode;
    allowedRoles?: UserRole[];
    requiredPermission?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    title?: string;
}

export interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}
