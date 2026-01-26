import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { SystemLogProvider } from './context/SystemLogContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastSystem';
import DashboardLayout from './components/layout/DashboardLayout';
import PageTransition from './components/layout/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import AppErrorBoundary from './components/AppErrorBoundary';
import DevOverlay from './components/DevOverlay';
import CakeLoader from './components/CakeLoader';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderSyncProvider } from './context/OrderSyncContext';

import { ROUTES } from './config/routes.config';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  // Helper to render a single route node
  const renderRoute = (route) => {
    let element = route.element;

    // 1. Wrap in PageTransition if needed
    if (route.useTransition) {
      element = <PageTransition>{element}</PageTransition>;
    }

    // 2. Wrap in ProtectedRoute if roles are specified
    // Note: Public routes usually refer to login/register which don't have roles.
    // If a route has roles, it is protected.
    if (route.roles && route.roles.length > 0) {
      element = (
        <ProtectedRoute allowedRoles={route.roles}>
          {element}
        </ProtectedRoute>
      );
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={element}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 1. Routes WITHOUT Dashboard Layout (Public, Fullscreen) */}
        {ROUTES.filter(r => r.layout !== 'dashboard').map(renderRoute)}

        {/* 2. Routes WITH Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          {ROUTES.filter(r => r.layout === 'dashboard').map(renderRoute)}

          {/* Fallback Redirects */}
          {/* These could also be in config, but keeping simple here */}
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
                <AppErrorBoundary>
                  <Router>
                    <DevOverlay />
                    <Suspense fallback={<CakeLoader isLoading={true} />}>
                      <AnimatedRoutes />
                    </Suspense>
                  </Router>
                </AppErrorBoundary>
              </ToastProvider>
            </SystemLogProvider>
          </OrderSyncProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
