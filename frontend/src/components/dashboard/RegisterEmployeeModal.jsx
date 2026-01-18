import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Mail, Lock, ChefHat, QrCode, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../../services/api';

const RegisterEmployeeModal = ({ isOpen, onClose }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Empleado'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'invite'
    const [inviteUrl, setInviteUrl] = useState(null);

    if (!isOpen) return null;

    const handleGenerateInvite = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/generate-invite');
            const url = `${window.location.origin}/register?inviteToken=${response.data.token}`;
            setInviteUrl(url);
        } catch (err) {
            setError('Error al generar invitación.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (inviteUrl) {
            navigator.clipboard.writeText(inviteUrl);
            setSuccess('Enlace copiado al portapapeles');
            setTimeout(() => setSuccess(''), 2000);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register(formData);
            setSuccess('Empleado registrado exitosamente.');
            setFormData({ username: '', email: '', password: '', role: 'Empleado' });
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md w-full relative overflow-hidden"
            >
                <div className="h-2 bg-bakery-primary w-full absolute top-0" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-bakery-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-bakery-primary">
                            <ChefHat size={24} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Nuevo Empleado</h2>
                        <p className="text-gray-500 text-sm">Crea una cuenta para tu equipo</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">
                            {success}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 mb-6">
                        <button
                            onClick={() => { setActiveTab('manual'); setError(''); setSuccess(''); setInviteUrl(null); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'manual' ? 'text-bakery-primary border-b-2 border-bakery-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Manual
                        </button>
                        <button
                            onClick={() => { setActiveTab('invite'); setError(''); setSuccess(''); setInviteUrl(null); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'invite' ? 'text-bakery-primary border-b-2 border-bakery-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Invitación QR
                        </button>
                    </div>

                    {activeTab === 'manual' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nombre del empleado"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bakery-primary/20 focus:border-bakery-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bakery-primary/20 focus:border-bakery-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña temporal"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bakery-primary/20 focus:border-bakery-primary outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-bakery-primary hover:bg-bakery-accent text-white font-bold py-3 rounded-xl shadow-lg shadow-bakery-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-4"
                            >
                                {loading ? 'Registrando...' : 'Registrar Empleado'}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            {!inviteUrl ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm mb-4">Genera un código QR único para que tu empleado se registre por su cuenta.</p>
                                    <button
                                        onClick={handleGenerateInvite}
                                        disabled={loading}
                                        className="bg-bakery-accent text-white px-6 py-2 rounded-full shadow hover:bg-orange-600 transition-all font-bold"
                                    >
                                        {loading ? 'Generando...' : 'Generar QR'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Rustic Frame */}
                                    <div className="p-4 bg-[#EFEBE9] rounded-lg shadow-xl relative border-4 border-[#5D4037] border-double" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}>
                                        <div className="absolute top-0 left-0 w-full h-full border border-dashed border-[#8D6E63] pointer-events-none opacity-50 m-1 rounded" />
                                        <QRCodeCanvas
                                            value={inviteUrl}
                                            size={200}
                                            fgColor="#3E2723"
                                            bgColor="#EFEBE9"
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 font-mono">Expira en 24h</p>

                                    <div className="flex items-center gap-2 mt-4 bg-gray-50 p-2 rounded-lg w-full border border-gray-200">
                                        <input
                                            readOnly
                                            value={inviteUrl}
                                            className="bg-transparent text-xs text-gray-500 w-full outline-none"
                                        />
                                        <button onClick={copyToClipboard} className="text-bakery-primary hover:text-bakery-accent p-1">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </motion.div >
        </div >
    );
};

export default RegisterEmployeeModal;
