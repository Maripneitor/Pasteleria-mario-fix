import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import FolioManager from './components/FolioManager';
import { LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow h-16 flex items-center justify-between px-6 z-10">
        <h1 className="text-xl font-bold text-gray-800">Pastelería Panel</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">Hola, {user.email}</span>}
          <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Cerrar Sesión">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/folios" element={
            <ProtectedRoute>
              <Layout>
                <FolioManager />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/folios" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
