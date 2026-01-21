import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SystemLogProvider } from './context/SystemLogContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastSystem';
import Layout from './components/Layout';
import PageTransition from './components/layout/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import DevOverlay from './components/DevOverlay';
import CakeLoader from './components/CakeLoader';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Sticky/Critical imports can remain if lightweight, but pages should be lazy
const LogIn = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DevDashboard = lazy(() => import('./pages/DevDashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const AiInbox = lazy(() => import('./pages/AiInbox'));
const Folios = lazy(() => import('./pages/Folios'));
const NewFolio = lazy(() => import('./pages/NewFolio'));
const KanbanBoard = lazy(() => import('./components/KanbanBoard')); // Note: Imported from components in original
const Statistics = lazy(() => import('./pages/Statistics'));
const Clients = lazy(() => import('./pages/Clients'));
const SystemHealth = lazy(() => import('./pages/SystemHealth'));
const AdminOwnerManagement = lazy(() => import('./pages/AdminOwnerManagement'));
const AdminGlobalAnalytics = lazy(() => import('./pages/AdminGlobalAnalytics'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const BakeryConfig = lazy(() => import('./pages/BakeryConfig'));


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
                  <Suspense fallback={<CakeLoader />}>
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
                          <Route path="/admin/users" element={<AdminUserManagement />} />
                        </Route>

                        {/* Dashboard - Accessible by all roles (internal logic handles views) */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                          <Route path="/calendario" element={<PageTransition><Calendar /></PageTransition>} />
                          <Route path="/folios" element={<PageTransition><Folios /></PageTransition>} />
                          <Route path="/folio/nuevo" element={<PageTransition><NewFolio /></PageTransition>} />
                          <Route path="/produccion" element={<PageTransition><KanbanBoard /></PageTransition>} />
                          <Route path="/estadisticas" element={<PageTransition><Statistics /></PageTransition>} />
                          <Route path="/clientes" element={<PageTransition><Clients /></PageTransition>} />
                        </Route>




                        {/* Inbox - Admin/Seller/Owner */}
                        <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor', 'Dueño']} />}>
                          <Route path="/bandeja-ia" element={<AiInbox />} />
                          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
                        </Route>

                        {/* Config - Admin/Owner */}
                        <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Dueño']} />}>
                          <Route path="/config" element={
                            <PageTransition>
                              <BakeryConfig />
                            </PageTransition>
                          } />
                        </Route>
                      </Route>

                      {/* Fallback */}
                      <Route path="/" element={<Navigate to="/folios" replace />} />
                      <Route path="*" element={<Navigate to="/folios" replace />} />
                    </Routes>
                  </Suspense>
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
