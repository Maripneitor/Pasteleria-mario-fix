import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="dark:bg-bakery-950 h-screen flex items-center justify-center text-gray-500">Cargando...</div>;

    // 1. Check Authentication
    if (!user) return <Navigate to="/login" replace />;

    // 2. Check Authorization (Role)
    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            // User logged in but not authorized for this specific route
            console.warn(`Access denied for role: ${user.role} to route requiring: ${allowedRoles.join(', ')}`);
            return <Navigate to="/dashboard" replace />;
        }
    }

    // 3. Render content
    return <Outlet />;
};

export default ProtectedRoute;
