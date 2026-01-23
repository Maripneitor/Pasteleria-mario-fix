import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRouteProps } from '@/types';

const PrivateRoute = ({ allowedRoles, requiredPermission }: ProtectedRouteProps) => {
    const { user, loading, hasPermission } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Check permission-based access
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
