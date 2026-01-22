import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], requiredPermission = null }) => {
    const { user, loading, currentBranch, hasPermission } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Validar contexto de sucursal (Multi-tenant)
    // Se asume que todo usuario debe operar bajo una sucursal.
    // Si no tiene, debería mostrarse una UI para seleccionarla o contactar soporte.
    if (!currentBranch) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <h1 className="text-xl font-bold text-gray-700 mb-2">Sin Sucursal Activa</h1>
                <p className="text-gray-500">Tu usuario no tiene una sucursal asignada o seleccionada.</p>
                {/* Aquí podría ir un selector de sucursal si hay múltiples disponibles pero ninguna seleccionada */}
            </div>
        );
    }

    // Check Permission (New RBAC System)
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Role check (Legacy Support - to be deprecated)
    if (allowedRoles.length > 0) {
        const userRole = (user.role || '').toLowerCase();
        const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

        if (!normalizedAllowed.includes(userRole)) {
            return <Navigate to="/dashboard" replace />; // Redirect to safe page
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
