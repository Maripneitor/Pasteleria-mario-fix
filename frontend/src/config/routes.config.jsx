import React, { lazy } from 'react';
import { ROLES } from './permissions';

// Lazy Load Components
const LogIn = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const DevDashboard = lazy(() => import('../pages/DevDashboard'));
const Calendar = lazy(() => import('../pages/Calendar'));
const AiInbox = lazy(() => import('../pages/AiInbox'));
const SessionConsole = lazy(() => import('../pages/SessionConsole'));
const Folios = lazy(() => import('../pages/Folios'));
const NewFolio = lazy(() => import('../pages/NewFolio'));
const KanbanBoard = lazy(() => import('../components/KanbanBoard'));
const Statistics = lazy(() => import('../pages/Statistics'));
const Clients = lazy(() => import('../pages/Clients'));
const SystemHealth = lazy(() => import('../pages/SystemHealth'));
const AdminOwnerManagement = lazy(() => import('../pages/AdminOwnerManagement'));
const AdminGlobalAnalytics = lazy(() => import('../pages/AdminGlobalAnalytics'));
const AdminUserManagement = lazy(() => import('../pages/AdminUserManagement'));
const AdminTenantControl = lazy(() => import('../pages/AdminTenantControl'));
const BranchSettings = lazy(() => import('../pages/BranchSettings'));
const OwnerDashboard = lazy(() => import('../pages/OwnerDashboard'));
const DeveloperDashboard = lazy(() => import('../pages/DeveloperDashboard'));
const BakeryConfig = lazy(() => import('../pages/BakeryConfig'));
const KitchenDisplay = lazy(() => import('../pages/KitchenDisplay'));
const PageTransition = lazy(() => import('../components/layout/PageTransition')); // Wrap in lazy if it's default export
// Note: PageTransition is likely a normal component import in App.jsx, but since we are defining elements here, 
// we can wrap them. However, usually PageTransition wraps children.
// To simplify, we'll import PageTransition normally or handle it in the element definition if possible.
// But importing non-lazy in a config file might break splitting if not careful.
// Let's assume PageTransition is lightweight.

import AccessDenied from '../pages/AccessDenied';

// Helper Wrapper for transitions
const WithTransition = ({ children }) => (
    <React.Suspense fallback={<div>...</div>}>
        {children}
    </React.Suspense>
    // Note: The actual PageTransition wrapper logic will be inside the component or we can add it here.
    // In App.jsx it was: <PageTransition><Dashboard /></PageTransition>
);

export const ROUTES = [
    // --- Public Routes ---
    {
        path: '/login',
        element: <LogIn />,
        isPublic: true,
        roles: [],
    },
    {
        path: '/register',
        element: <Register />,
        isPublic: true,
        roles: [],
    },
    {
        path: '/access-denied',
        element: <AccessDenied />,
        isPublic: true, // Semi-public, accessible to logged in users but special
        roles: []
    },

    // --- Fullscreen / App Routes (Outside DashboardLayout) ---
    {
        path: '/kitchen',
        element: <KitchenDisplay />,
        layout: 'fullscreen',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE], // Removed PRODUCTION as it was undefined in permissions.js
        breadcrumb: 'Pantalla de Cocina'
    },

    // --- Protected Dashboard Routes ---
    // Developer Specific
    {
        path: '/dev-dashboard',
        element: <DevDashboard />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Dashboard Developer'
    },
    {
        path: '/dashboard/developer',
        element: <DeveloperDashboard />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Developer Console'
    },
    {
        path: '/system-health',
        element: <SystemHealth />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Estado del Sistema'
    },
    // Admin Tools
    {
        path: '/admin/owners',
        element: <AdminOwnerManagement />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Gestión de Dueños'
    },
    {
        path: '/admin/global-analytics',
        element: <AdminGlobalAnalytics />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Analíticas Globales'
    },
    {
        path: '/admin/users',
        element: <AdminUserManagement />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Usuarios Globales'
    },
    {
        path: '/admin/tenants',
        element: <AdminTenantControl />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER],
        breadcrumb: 'Control de Tenants'
    },

    // Owner & Developer
    {
        path: '/dashboard',
        element: <Dashboard />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Inicio',
        useTransition: true
    },
    {
        path: '/dashboard/owner',
        element: <OwnerDashboard />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Dashboard Dueño',
        useTransition: true
    },
    {
        path: '/calendario',
        element: <Calendar />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Calendario',
        useTransition: true
    },
    {
        path: '/estadisticas',
        element: <Statistics />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Estadísticas',
        useTransition: true
    },
    {
        path: '/clientes',
        element: <Clients />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Clientes',
        useTransition: true
    },
    {
        path: '/inventario',
        // Placeholder reused Statistics in App.jsx, keeping same mapping
        element: <Statistics />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Inventario',
        useTransition: true
    },
    {
        path: '/configuracion',
        element: <BakeryConfig />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Configuración',
        useTransition: true
    },
    {
        path: '/configuracion/sucursal',
        element: <BranchSettings />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER],
        breadcrumb: 'Configuración Sucursal',
        useTransition: true
    },

    // Employee, Owner & Developer
    {
        path: '/folios',
        element: <Folios />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE],
        breadcrumb: 'Pedidos (Folios)',
        useTransition: true
    },
    {
        path: '/folio/nuevo',
        element: <NewFolio />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE],
        breadcrumb: 'Nuevo Pedido',
        useTransition: true
    },
    {
        path: '/produccion',
        element: <KanbanBoard />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE],
        breadcrumb: 'Producción',
        useTransition: true
    },
    {
        path: '/asistente-ia',
        element: <AiInbox />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE],
        breadcrumb: 'Asistente IA',
        useTransition: true
    },
    {
        path: '/ia-sesiones/:id',
        element: <SessionConsole />,
        layout: 'dashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE],
        breadcrumb: 'Sesión IA',
        useTransition: true
    }
];
