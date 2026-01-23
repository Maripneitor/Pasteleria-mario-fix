import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Key, ChefHat, Briefcase } from 'lucide-react';

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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50"
                style={{ backgroundImage: 'radial-gradient(#D4A373 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden relative z-10 border border-[#E6B8A2]"
            >
                {/* Header Decoration */}
                <div className="h-3 bg-[#D4A373]" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-[#4A403A]">Únete a La Fiesta</h2>
                        <p className="text-[#9C8C74] mt-2">Crea tu cuenta para comenzar</p>
                    </div>

                    {error && (
                        <div className="bg-[#3E2723] text-[#EFEBE9] text-sm p-4 rounded-lg mb-6 flex items-center gap-3 border-2 border-[#D7CCC8] shadow-md font-serif" style={{ borderStyle: 'dashed' }}>
                            <span className="text-xl">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#4A403A] flex items-center gap-2">
                                <User size={16} /> Nombre
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Tu nombre completo"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAFA] focus:ring-2 focus:ring-[#D4A373] focus:border-transparent outline-none transition-all"
                                onChange={handleChange} required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#4A403A] flex items-center gap-2">
                                <Mail size={16} /> Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="ejemplo@correo.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAFA] focus:ring-2 focus:ring-[#D4A373] focus:border-transparent outline-none transition-all"
                                onChange={handleChange} required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#4A403A] flex items-center gap-2">
                                <Lock size={16} /> Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAFA] focus:ring-2 focus:ring-[#D4A373] focus:border-transparent outline-none transition-all"
                                onChange={(e) => {
                                    handleChange(e);
                                    // Live validation logic could be here, but using Simple HTML5 pattern/onInvalid for now or checking on Submit
                                }}
                                required
                            />
                            {/* Password Strength Indicators */}
                            <div className="mt-2 grid grid-cols-4 gap-1">
                                <div className={`h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 px-1">
                                <span>8+ chars</span>
                                <span>Mayúscula</span>
                                <span>Número</span>
                                <span>Simbolo</span>
                            </div>
                        </div>

                        {/* Role Selection (Locked if Invite) */}
                        {!inviteToken ? (
                            <div className="pt-2">
                                <label className="text-sm font-semibold text-[#4A403A] block mb-2">Rol deseado</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'Dueño' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'Dueño' ? 'border-[#D4A373] bg-[#FEFAE0] text-[#4A403A]' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        <Briefcase size={20} />
                                        <span className="text-xs font-bold">Dueño / Admin</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'Empleado' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'Empleado' ? 'border-[#D4A373] bg-[#FEFAE0] text-[#4A403A]' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4A373] hover:bg-[#C29263] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#D4A373]/30 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>
                </div>

                <div className="bg-[#FAFAFA] p-4 text-center border-t border-gray-100">
                    <p className="text-sm text-[#9C8C74]">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-[#D4A373] font-bold hover:underline">Inicia Sesión</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
