import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import AiInbox from './pages/AiInbox';
import Folios from './pages/Folios';
import NewFolio from './pages/NewFolio';
// import FolioForm from './components/FolioForm'; // Not a page, used inside NewFolio
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import { ToastProvider } from './context/ToastSystem';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes Wrapper */}
            <Route element={<Layout />}>
              {/* Dashboard - Accessible by all roles (internal logic handles views) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* General Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/calendario" element={<Calendar />} />
                <Route path="/folios" element={<Folios />} />
                <Route path="/folio/nuevo" element={<NewFolio />} />
              </Route>

              {/* Inbox - Admin/Seller */}
              <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor']} />}>
                <Route path="/bandeja-ia" element={<AiInbox />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/folios" replace />} />
            <Route path="*" element={<Navigate to="/folios" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
