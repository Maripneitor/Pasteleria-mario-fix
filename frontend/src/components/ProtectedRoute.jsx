import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role check - if allowedRoles is provided and not empty
    if (allowedRoles.length > 0) {
        const userRole = (user.role || '').toLowerCase();
        const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

        if (!normalizedAllowed.includes(userRole)) {
            // Redirect to a default authorized page or Unauthorized page
            // For simplicity, sticking to the app's default /folios or just staying put (conceptually hard with Navigate)
            // Let's redirect to /folios as a safe default for non-admins
            return <Navigate to="/folios" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
