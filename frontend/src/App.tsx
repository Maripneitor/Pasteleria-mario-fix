import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastSystem';
import { SocketProvider } from '@/contexts/SocketContext';
import { SystemLogProvider } from '@/contexts/SystemLogContext';

// Components
import GlobalErrorBoundary from '@/components/features/common/GlobalErrorBoundary';
import CakeLoader from '@/components/ui/CakeLoader';

// Routes
import AppRoutes from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Note: BrowserRouter should be here if AppRoutes doesn't include it. 
  // Assuming AppRoutes uses Routes/Route but relies on parent Router.
  // However, the original App.jsx code used BrowserRouter wrapping AppRoutes.

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <SocketProvider>
              <SystemLogProvider>
                <GlobalErrorBoundary>
                  <BrowserRouter>
                    <Suspense fallback={<CakeLoader isLoading={true} />}>
                      <AppRoutes />
                    </Suspense>
                  </BrowserRouter>
                </GlobalErrorBoundary>
              </SystemLogProvider>
            </SocketProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
