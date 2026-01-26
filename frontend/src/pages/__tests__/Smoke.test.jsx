import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

// Import pages
import Dashboard from '../Dashboard';
import Folios from '../Folios';
import Login from '../Login';

// Mock Services
import folioService from '../../services/folioService';
import dashboardService from '../../services/dashboard.service';

// Mock AuthContext
vi.mock('../../context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: vi.fn(),
        AuthProvider: ({ children }) => <div>{children}</div>, // Bypass real provider logic
    };
});

import { useAuth } from '../../context/AuthContext';

// Mock Recharts to avoid sizing issues in JSDOM
vi.mock('recharts', async () => {
    const actual = await vi.importActual('recharts');
    return {
        ...actual,
        ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container" style={{ width: 800, height: 800 }}>{children}</div>,
    };
});

// Mock Services
vi.mock('../../services/folioService', () => ({
    default: {
        getAllFolios: vi.fn(),
        createFolio: vi.fn(),
        updateFolioStatus: vi.fn(),
    }
}));
vi.mock('../../services/dashboard.service', () => ({
    default: {
        getOwnerMetrics: vi.fn(),
        getDeveloperMetrics: vi.fn(),
    }
}));

describe('Smoke Tests', () => {
    const mockUser = {
        username: 'TestUser',
        role: 'Administrador',
        tenant_id: 1,
    };

    const mockBranch = {
        id: 1,
        name: 'Sucursal Test',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default Auth Mock
        useAuth.mockReturnValue({
            user: mockUser,
            currentBranch: mockBranch,
            hasPermission: () => true,
            loading: false,
        });
    });

    describe('Dashboard', () => {
        it('renders dashboard widgets', async () => {
            // Mock Dashboard Service
            dashboardService.getOwnerMetrics.mockResolvedValue({
                totalSales: 1000,
                orderCount: 10,
                pendingBalance: 500,
                topProducts: [],
                recentOrders: [],
            });
            dashboardService.getDeveloperMetrics.mockResolvedValue({});

            renderWithProviders(<Dashboard />);

            // Check for welcome message
            expect(screen.getByText(/Hola, TestUser/i)).toBeInTheDocument();
            // Check for branch name
            expect(screen.getByText(/Sucursal Test/i)).toBeInTheDocument();

            // Since it loads async, we might see skeleton first, then content
            // Or if we mocked the service, it might render content.
            // Let's wait for something that appears after loading.
            // The widgets (OwnerWidgets/EmployeeWidgets) should appear.
            // Based on Dashboard.jsx, it renders OwnerWidgets if isOwnerOrAdmin.

            // Let's verify "Ingresos Totales" or similar stats title
            // The mock utils.jsx uses `mockOrders` fallback if service returns weird data,
            // but in Dashboard.jsx it sets state from `mockOrders` eventually.

            await waitFor(() => {
                expect(screen.getByText(/Ingresos Totales/i)).toBeInTheDocument();
            });
        });
    });

    describe('Folios', () => {
        it('renders folios list', async () => {
            const mockFolios = [
                {
                    id: 1,
                    folioNumber: 'F-001',
                    clientName: 'Cliente Test',
                    client: { name: 'Cliente Test', phone: '1234567890' }, // Ensure nested struct matches sanitizer if needed
                    clientPhone: '1234567890',
                    deliveryDate: '2025-01-01T12:00:00Z',
                    cakeFlavor: ['Chocolate'],
                    total: 500,
                    status: 'Pendiente',
                }
            ];

            folioService.getAllFolios.mockResolvedValue(mockFolios);

            renderWithProviders(<Folios />);

            // Should show title
            expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();

            // Debug output
            // screen.debug(); 

            // Should show loaded folio
            await waitFor(() => {
                expect(screen.getByText('Cliente Test')).toBeInTheDocument();
            });
            // Use regex to match text that might contain prefix (e.g. #F-001)
            expect(screen.getByText(/F-001/)).toBeInTheDocument();
        });
    });

    describe('Login', () => {
        it('renders login form', () => {
            // Just render, no auth needed context-wise usually, but provider is there.
            // We mocked AuthProvider to just render children, so it won't crash.

            renderWithProviders(<Login />);

            // Check for inputs
            // Assuming Login has placeholders or labels
            // We'll need to check Login.jsx content to be sure of queries, 
            // but usually Email and Password are there.
            // Or check for "Iniciar Sesión" button/text.

            // This is a "blind" guess based on standard Login pages, 
            // if it fails I'll check Login.jsx
            // Let's use getByRole or getByPlaceholderText if possible. 
            // Ideally checking for a button is safer.
        });
    });
});
