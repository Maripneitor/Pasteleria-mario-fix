import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ProductionStepper from '../components/ui/ProductionStepper';
import NotificationCard from '../components/ui/NotificationCard';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastSystem';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showSuccess } = useToast();

    // Default role just in case
    const role = user?.role || 'Guest';

    // Animation Variants
    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    // Simulate "Page Load" effect
    useEffect(() => {
        // Example welcome toast if desired
    }, []);

    const heading = "Pastelería La Fiesta";

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-red-50 font-sans text-gray-900 flex">

            {/* Conditional Navigation */}
            <Navigation />

            <main className="flex-1 w-full max-w-7xl px-4 md:px-10 py-10 md:py-12 md:ml-20 mb-20 md:mb-0 overflow-x-hidden">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-10"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            {/* Text Reveal Title */}
                            <motion.h1
                                className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 tracking-tight"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {heading.split("").map((char, index) => (
                                    <motion.span key={index} variants={letterVariants} transition={{ duration: 0.5 }}>
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.h1>
                            <motion.p variants={letterVariants} className="text-gray-400 mt-2 font-medium">
                                Panel de {role}
                            </motion.p>
                        </div>

                        <motion.div variants={letterVariants}>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm flex items-center gap-2 ${role === 'Administrador' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                role === 'Repostero' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                {user?.name || 'Usuario'}
                            </div>
                        </motion.div>
                    </div>

                    {/* Role Based Content - Cleaned Up */}
                    {role === 'Administrador' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Stats Column */}
                            <div className="lg:col-span-8 space-y-8">
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                                    variants={containerVariants}
                                >
                                    <StatCard title="Ventas del Día" value="$2,450" icon="💰" color="bg-green-100 text-green-600" delay={0.1} />
                                    <StatCard title="Pedidos Activos" value="12" icon="📦" color="bg-blue-100 text-blue-600" delay={0.2} />
                                    <StatCard title="Pendientes" value="5" icon="⏳" color="bg-yellow-100 text-yellow-600" delay={0.3} />
                                </motion.div>

                                {/* Main Graph/Content Area */}
                                <motion.div
                                    variants={letterVariants}
                                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="text-center z-10">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Resumen Semanal</h3>
                                        <p className="text-gray-400 text-sm">Próximamente gráficas interactivas</p>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-50/20 to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.div>
                            </div>

                            {/* Notifications Area */}
                            <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-end">
                                <NotificationCard message="Alerta IA" text="Inventario de harina bajo. Pronóstico sugiere reabastecer hoy." />
                            </div>
                        </div>
                    )}

                    {role === 'Vendedor' && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                        >
                            <DashboardAction
                                title="Nuevo Pedido"
                                desc="Crear orden personalizada"
                                color="from-red-500 to-red-600"
                                onClick={() => navigate('/folio/nuevo')}
                                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                            />
                            <DashboardAction
                                title="Ver Calendario"
                                desc="Consultar fechas de entrega"
                                color="from-blue-500 to-blue-600"
                                onClick={() => navigate('/calendario')}
                                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                            />
                            <div className="md:col-span-2">
                                <NotificationCard message="Recordatorio" text="Revisar pedidos para entrega de mañana." />
                            </div>
                        </motion.div>
                    )}

                    {role === 'Repostero' && (
                        <motion.div className="max-w-3xl mx-auto space-y-10" variants={containerVariants}>
                            {/* Production Item 1 */}
                            <ProductionItem
                                id="#105"
                                name="Pastel de Chocolate"
                                tag="Urgente"
                                currentStep={2}
                            />

                            {/* Production Item 2 */}
                            <ProductionItem
                                id="#106"
                                name="Tres Leches"
                                tag="Para Mañana"
                                currentStep={1}
                                steps={[
                                    { title: "Confirmado", time: "11:30 AM", status: "Listo" },
                                    { title: "En Horno", time: "Estimado: 2:00 PM", status: "Pendiente" },
                                    { title: "Decoración", time: "Estimado: 3:30 PM", status: "Pendiente" }
                                ]}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, color }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all duration-300"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${color}`}>{icon}</div>
        <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
        </div>
    </motion.div>
);

const DashboardAction = ({ title, desc, color, onClick, icon }) => (
    <motion.button
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden w-full h-48 rounded-3xl shadow-lg shadow-gray-200/50 flex flex-col justify-end p-6 text-left group bg-gradient-to-br ${color}`}
    >
        <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:rotate-12 transition-transform duration-300">
            {icon}
        </div>
        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
            <p className="text-white/80 font-medium">{desc}</p>
        </div>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
    </motion.button>
);

const ProductionItem = ({ id, name, tag, currentStep, steps }) => (
    <motion.div
        layout
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-800">{name} <span className="text-gray-400 font-normal text-base ml-2">{id}</span></h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${tag === 'Urgente' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{tag}</span>
        </div>
        <ProductionStepper currentStep={currentStep} steps={steps} />
    </motion.div>
);

export default Dashboard;
