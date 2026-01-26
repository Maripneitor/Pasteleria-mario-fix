import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Key, ChefHat, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('inviteToken');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: inviteToken ? 'Empleado' : 'Dueño',
        inviteToken: inviteToken || ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Strict Password Validation
        const pwd = formData.password;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
        const isLengthy = pwd.length >= 8;

        if (!isLengthy || !hasUpper || !hasNumber || !hasSymbol) {
            setError("La contraseña es muy débil. Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.");
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError("Este correo ya está registrado en el libro de la pastelería.");
            } else {
                setError(err.response?.data?.message || 'Error al registrarse');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50"
                style={{ backgroundImage: 'radial-gradient(#D4A373 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-brand-primary/20">
                    <div className="h-3 bg-brand-primary" />
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-serif text-brand-secondary">Únete a La Fiesta</CardTitle>
                        <CardDescription>Crea tu cuenta para comenzar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-200 border-dashed">
                                <span className="text-xl">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nombre"
                                name="username"
                                placeholder="Tu nombre completo"
                                icon={User}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="ejemplo@correo.com"
                                icon={Mail}
                                onChange={handleChange}
                                required
                            />

                            <div>
                                <Input
                                    label="Contraseña"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    onChange={handleChange}
                                    required
                                />
                                {/* Password Strength Indicators */}
                                <div className="mt-2 grid grid-cols-4 gap-1">
                                    <div className={`h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`h-1 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-text-secondary px-1 mt-1">
                                    <span>8+ chars</span>
                                    <span>Mayúscula</span>
                                    <span>Número</span>
                                    <span>Simbolo</span>
                                </div>
                            </div>

                            {/* Role Selection (Locked if Invite) */}
                            {!inviteToken ? (
                                <div className="pt-2">
                                    <label className="text-sm font-semibold text-text-primary block mb-2">Rol deseado</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Dueño' })}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'Dueño' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-border text-text-secondary hover:bg-surface-muted'}`}
                                        >
                                            <Briefcase size={20} />
                                            <span className="text-xs font-bold">Dueño / Admin</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Empleado' })}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'Empleado' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-border text-text-secondary hover:bg-surface-muted'}`}
                                        >
                                            <ChefHat size={20} />
                                            <span className="text-xs font-bold">Empleado</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-green-700 text-sm flex items-center gap-2">
                                    <Key size={16} />
                                    <span>Aplicando <strong>Invitación de Personal</strong></span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full mt-4"
                                variant="solid"
                            >
                                Crear Cuenta
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center bg-surface-muted/50 border-t py-4">
                        <p className="text-sm text-text-secondary">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-brand-primary font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
