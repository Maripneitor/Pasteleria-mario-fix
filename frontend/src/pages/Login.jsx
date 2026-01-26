import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useToast } from '../context/ToastSystem';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';

import { ChefHat, Mail, Lock } from 'lucide-react';
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
            <Card className="w-full max-w-md relative z-10">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🍰</span>
                        </div>
                    </div>
                    <CardTitle>Iniciar Sesión</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            icon={Mail}
                            placeholder="ejemplo@correo.com"
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            icon={Lock}
                            placeholder="••••••••"
                        />
                        <Button
                            type="submit"
                            variant="solid"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Chef Access Button */}
            <div className="absolute top-4 right-4 z-20">
                <Button
                    onClick={() => setShowPinPad(true)}
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-lg h-12 w-12 bg-surface hover:text-brand-primary border-border"
                >
                    <ChefHat size={24} />
                </Button>
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
