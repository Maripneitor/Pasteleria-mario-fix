import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes.config';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {routes.filter(r => !r.protected).map(route => (
                <Route key={route.path} path={route.path} element={<route.component />} />
            ))}

            {/* Protected Routes */}
            <Route element={<DashboardLayout children={null} />}>
                {routes.filter(r => r.protected).map(route => (
                    <Route key={route.path} element={<PrivateRoute allowedRoles={route.allowedRoles as any} />}>
                        <Route path={route.path} element={<route.component />} />
                    </Route>
                ))}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
