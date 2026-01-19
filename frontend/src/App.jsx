import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SystemLogProvider } from './context/SystemLogContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastSystem';
import LogIn from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DevDashboard from './pages/DevDashboard';
import Calendar from './pages/Calendar';
import AiInbox from './pages/AiInbox';
import Folios from './pages/Folios';
import NewFolio from './pages/NewFolio';
import KanbanBoard from './components/KanbanBoard';
import Statistics from './pages/Statistics';
import Inventory from './pages/Inventory';
import Clients from './pages/Clients';
import SystemHealth from './pages/SystemHealth';
import AdminOwnerManagement from './pages/AdminOwnerManagement';
import AdminGlobalAnalytics from './pages/AdminGlobalAnalytics';
import OwnerDashboard from './pages/OwnerDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import DevOverlay from './components/DevOverlay';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SystemLogProvider>
            <ToastProvider>
              <GlobalErrorBoundary>
                <Router>
                  <DevOverlay />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes Wrapper */}
                    <Route element={<Layout />}>
                      {/* Developer Only Route (Hidden) */}
                      <Route element={<ProtectedRoute allowedRoles={['Desarrollador']} />}>
                        <Route path="/dev-dashboard" element={<DevDashboard />} />
                        <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
                        <Route path="/system-health" element={<SystemHealth />} />
                      </Route>

                      <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                        <Route path="/admin/owners" element={<AdminOwnerManagement />} />
                        <Route path="/admin/global-analytics" element={<AdminGlobalAnalytics />} />
                      </Route>

                      {/* Dashboard - Accessible by all roles (internal logic handles views) */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                      </Route>

                      {/* General Protected Routes */}
                      <Route path="/calendario" element={<Calendar />} />
                      <Route path="/folios" element={<Folios />} />
                      <Route path="/folio/nuevo" element={<NewFolio />} />
                      <Route path="/produccion" element={<KanbanBoard />} />
                      <Route path="/estadisticas" element={<Statistics />} />
                      <Route path="/clientes" element={<Clients />} />


                      {/* Inventory - Restricted */}
                      <Route element={<ProtectedRoute allowedRoles={['Desarrollador']} />}>
                        <Route path="/inventario" element={<Inventory />} />
                      </Route>

                      {/* Inbox - Admin/Seller/Owner */}
                      <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor', 'Dueño']} />}>
                        <Route path="/bandeja-ia" element={<AiInbox />} />
                        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                      </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="/" element={<Navigate to="/folios" replace />} />
                    <Route path="*" element={<Navigate to="/folios" replace />} />
                  </Routes>
                </Router>
              </GlobalErrorBoundary>
            </ToastProvider>
          </SystemLogProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
