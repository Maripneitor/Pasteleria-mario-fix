import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, currentBranch, loading } = useAuth();

    if (loading) return <div className="dark:bg-bakery-950 h-screen">Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;

    // Si no hay sucursal, no bloqueamos con blanco, permitimos que AuthContext la asigne
    return <Outlet />;
};

export default ProtectedRoute;
