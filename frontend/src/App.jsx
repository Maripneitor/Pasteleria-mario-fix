import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { SystemLogProvider } from './context/SystemLogContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastSystem';
import DashboardLayout from './components/layout/DashboardLayout';
import PageTransition from './components/layout/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import DevOverlay from './components/DevOverlay';
import CakeLoader from './components/CakeLoader';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ROLES } from './config/permissions';

// Sticky/Critical imports can remain if lightweight, but pages should be lazy
const LogIn = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const AiInbox = lazy(() => import('./pages/AiInbox'));
const SessionConsole = lazy(() => import('./pages/SessionConsole'));
const Folios = lazy(() => import('./pages/Folios'));
const NewFolio = lazy(() => import('./pages/NewFolio'));
const KanbanBoard = lazy(() => import('./components/KanbanBoard'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Clients = lazy(() => import('./pages/Clients'));
const SystemHealth = lazy(() => import('./pages/SystemHealth'));
const AdminOwnerManagement = lazy(() => import('./pages/AdminOwnerManagement'));
const AdminGlobalAnalytics = lazy(() => import('./pages/AdminGlobalAnalytics'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminTenantControl = lazy(() => import('./pages/AdminTenantControl'));
const BranchSettings = lazy(() => import('./pages/BranchSettings')); // New Route // New Route
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const BakeryConfig = lazy(() => import('./pages/BakeryConfig'));
const KitchenDisplay = lazy(() => import('./pages/KitchenDisplay')); // KDS
import { OrderSyncProvider } from './context/OrderSyncContext';

const queryClient = new QueryClient();

// ...

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        {/* Independent/Full Screen Routes */}
        <Route path="/kitchen" element={
          <ProtectedRoute allowedRoles={[ROLES.DEVELOPER, ROLES.OWNER, ROLES.PRODUCTION, ROLES.EMPLOYEE]}>
            <KitchenDisplay />
          </ProtectedRoute>
        } />

        {/* Protected Routes Wrapper */}
        <Route element={<DashboardLayout />}>
          {/* Developer Only Route (Hidden) */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.DEVELOPER]} />}>
            <Route path="/dev-dashboard" element={<DevDashboard />} />
            <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
            <Route path="/system-health" element={<SystemHealth />} />
            {/* Admin tools */}
            <Route path="/admin/owners" element={<AdminOwnerManagement />} />
            <Route path="/admin/global-analytics" element={<AdminGlobalAnalytics />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/tenants" element={<AdminTenantControl />} />
          </Route>

          {/* Owner & Developer Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.DEVELOPER, ROLES.OWNER]} />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/dashboard/owner" element={<PageTransition><OwnerDashboard /></PageTransition>} />
            <Route path="/calendario" element={<PageTransition><Calendar /></PageTransition>} />
            <Route path="/estadisticas" element={<PageTransition><Statistics /></PageTransition>} />
            <Route path="/clientes" element={<PageTransition><Clients /></PageTransition>} />
            <Route path="/inventario" element={<PageTransition><Statistics /></PageTransition>} /> {/* Placeholder for Inventory */}
            <Route path="/configuracion" element={<PageTransition><BakeryConfig /></PageTransition>} />
            <Route path="/configuracion/sucursal" element={<PageTransition><BranchSettings /></PageTransition>} />
          </Route>

          {/* Employee, Owner & Developer (Production & Folios) */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE]} />}>
            <Route path="/folios" element={<PageTransition><Folios /></PageTransition>} />
            <Route path="/folio/nuevo" element={<PageTransition><NewFolio /></PageTransition>} />
            <Route path="/produccion" element={<PageTransition><KanbanBoard /></PageTransition>} />
            <Route path="/asistente-ia" element={<PageTransition><AiInbox /></PageTransition>} />
            <Route path="/ia-sesiones/:id" element={<PageTransition><SessionConsole /></PageTransition>} />
            {/* Fallback for employee dashboard access if needed */}
          </Route>

          {/* Fallback Redirects */}
          <Route path="/" element={<Navigate to="/folios" replace />} />
          <Route path="*" element={<Navigate to="/folios" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (


    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <OrderSyncProvider>
            <SystemLogProvider>
              <ToastProvider>
                <GlobalErrorBoundary>
                  <Router>
                    <DevOverlay />
                    <Suspense fallback={<CakeLoader isLoading={true} />}>
                      <AnimatedRoutes />
                    </Suspense>
                  </Router>
                </GlobalErrorBoundary>
              </ToastProvider>
            </SystemLogProvider>
          </OrderSyncProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
