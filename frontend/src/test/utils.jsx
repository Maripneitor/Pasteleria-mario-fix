import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastSystem';
import { OrderSyncProvider } from '../context/OrderSyncContext';
import { SystemLogProvider } from '../context/SystemLogContext';

// Create a new QueryClient for each test to avoid contamination
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Disable retries for testing
        },
    },
});

export function renderWithProviders(ui, { route = '/' } = {}) {
    const queryClient = createTestQueryClient();

    const Wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <OrderSyncProvider>
                        <SystemLogProvider>
                            <ToastProvider>
                                <MemoryRouter initialEntries={[route]}>
                                    {children}
                                </MemoryRouter>
                            </ToastProvider>
                        </SystemLogProvider>
                    </OrderSyncProvider>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );

    return {
        ...render(ui, { wrapper: Wrapper }),
        // Return the queryClient if needed
        queryClient,
    };
}
