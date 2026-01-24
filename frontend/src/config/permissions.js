export const ROLES = {
    DEVELOPER: 'Administrador', // Backend sends 'Administrador' for Super Users
    OWNER: 'Dueño',             // Backend sends 'Dueño'
    EMPLOYEE: 'Empleado'        // Backend sends 'Empleado'
};

export const MENU_ITEMS = [
    {
        path: '/dashboard',
        label: 'Panel Principal',
        icon: 'LayoutDashboard',
        roles: [ROLES.DEVELOPER, ROLES.OWNER]
    },
    {
        path: '/produccion',
        label: 'Producción (Kanban)',
        icon: 'ChefHat',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE]
    },
    {
        path: '/folios',
        label: 'Pedidos',
        icon: 'ShoppingBag',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE]
    },
    {
        path: '/inventario',
        label: 'Inventario',
        icon: 'Box',
        roles: [ROLES.DEVELOPER, ROLES.OWNER]
    },
    {
        path: '/configuracion',
        label: 'Configuración',
        icon: 'Settings',
        roles: [ROLES.DEVELOPER, ROLES.OWNER]
    },
    // La IA es para todos, pero con diferentes funciones
    {
        path: '/asistente-ia',
        label: 'Asistente IA',
        icon: 'Bot',
        roles: [ROLES.DEVELOPER, ROLES.OWNER, ROLES.EMPLOYEE]
    }
];
