import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useToast } from '../context/ToastSystem';
import BakeryButton from '../components/ui/BakeryButton';
import AnimatedInput from '../components/ui/AnimatedInput';

import { ChefHat } from 'lucide-react';
import PinPadModal from '../components/auth/PinPadModal';

const Login = () => {
    // ... existing state ...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPinPad, setShowPinPad] = useState(false); // State for modal
    const { login, user } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();

    // If already logged in, redirect
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        // ... existing login logic ...
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            const msg = error.response?.status === 401
                ? 'Credenciales incorrectas. Verifique su correo y contraseña.'
                : 'Error de conexión. Intente nuevamente.';
            showError('Error de acceso', msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinSuccess = () => {
        setShowPinPad(false);
        navigate('/kitchen');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-muted p-4 relative">
            <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-xl border border-border relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🍰</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatedInput
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <AnimatedInput
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <BakeryButton
                        type="submit"
                        variant="solid"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Entrar
                    </BakeryButton>
                </form>
            </div>

            {/* Chef Access Button */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => setShowPinPad(true)}
                    className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-brand-primary transition-colors"
                >
                    <ChefHat size={24} />
                </button>
            </div>

            <PinPadModal
                isOpen={showPinPad}
                onClose={() => setShowPinPad(false)}
                onSuccess={handlePinSuccess}
            />
        </div>
    );
};

export default Login;
