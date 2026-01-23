import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductionStepper from '../components/ui/ProductionStepper';
import { motion } from 'framer-motion';
import QuickActionBar from '../components/dashboard/QuickActionBar';
import ChalkMetricsBoard from '../components/dashboard/ChalkMetricsBoard';
import CashClosing from '../components/dashboard/CashClosing';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import CakeLoader from '../components/CakeLoader';
import EmptyState from '../components/EmptyState';

import { DollarSign, Package, Clock, PlusCircle, Calendar as CalendarIcon, UserPlus } from 'lucide-react';

const Dashboard = () => {
    const { user, currentBranch, hasPermission, getUserRoleLabel } = useAuth();
    const navigate = useNavigate();

    const roleLabel = getUserRoleLabel();

    const [inviteToken, setInviteToken] = React.useState(null);
    const [showQrModal, setShowQrModal] = React.useState(false);

    // Real Data State
    const [dailyStats, setDailyStats] = React.useState({
        totalSales: 0,
        activeOrders: 0,
        pendingOrders: 0,
        realIncome: 0,
        pendingBalance: 0
    });
    const [loadingStats, setLoadingStats] = React.useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (hasPermission('dashboard.view_stats') && currentBranch) {
                setLoadingStats(true);
                try {
                    // Assuming API handles branch filtering via header
                    const response = await api.get('/dashboard/daily-summary');
                    setDailyStats({
                        totalSales: response.data.totalSales || 0,
                        activeOrders: response.data.activeOrders || 0,
                        pendingOrders: response.data.pendingOrders || 0,
                        realIncome: response.data.realIncome || 0,
                        pendingBalance: response.data.pendingBalance || 0
                    });
                } catch (error) {
                    console.error("Error fetching dashboard stats:", error);
                } finally {
                    setLoadingStats(false);
                }
            } else {
                setLoadingStats(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user, currentBranch?.id, hasPermission]); // Reactive to branch change

    const generateInvite = async () => {
        if (!hasPermission('users.invite')) {
            alert("No tienes permiso para invitar usuarios.");
            return;
        }
        try {
            const response = await api.post('/auth/generate-invite');
            setInviteToken(response.data.token);
            setShowQrModal(true);
        } catch (error) {
            console.error("Error generating invite:", error);
            alert("Error generando invitación.");
        }
    };

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

    const heading = "Bienvenido a La Fiesta";

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-red-50 dark:from-bakery-950 dark:via-slate-900 dark:to-bakery-900 font-sans text-gray-900 dark:text-white">

            {/* Conditional Global Loader if initial page load depends on heavy calls, but here we use localized loaders mostly. 
                Using CakeLoader for stats specifically if we want to block interaction, OR inline skeletons. 
                Let's use CakeLoader for the initial transition only if strictly needed, or just let skeletons handle it.
            */}

            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
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
                            <motion.p variants={letterVariants} className="text-gray-400 mt-2 font-medium flex items-center gap-2">
                                Panel de {roleLabel}
                                {currentBranch && <span className="text-xs bg-bakery-100 text-bakery-800 px-2 py-0.5 rounded-full border border-bakery-200">@{currentBranch.name}</span>}
                            </motion.p>
                        </div>

                        <motion.div variants={letterVariants}>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm flex items-center gap-2 bg-white dark:bg-slate-800 dark:border-slate-700`}>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {user?.username}
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions Bar */}
                    <QuickActionBar />

                    {/* Stats Section with Local Loading State */}
                    {hasPermission('dashboard.view_stats') && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Stats Column */}
                            <div className="lg:col-span-8 space-y-8">
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                                    variants={containerVariants}
                                >
                                    <StatCard
                                        title="Ventas del Día"
                                        value={loadingStats ? "..." : `$${(dailyStats.totalSales || 0).toLocaleString()}`}
                                        icon={<DollarSign size={24} />}
                                        color="bg-green-100 text-green-600"
                                        delay={0.1}
                                        isLoading={loadingStats}
                                    />
                                    <StatCard
                                        title="Ingreso Real (Hoy)"
                                        value={loadingStats ? "..." : `$${(dailyStats.realIncome || 0).toLocaleString()}`}
                                        icon={<Package size={24} />}
                                        color="bg-blue-100 text-blue-600"
                                        delay={0.2}
                                        isLoading={loadingStats}
                                    />
                                    <StatCard
                                        title="Saldo Pendiente"
                                        value={loadingStats ? "..." : `$${(dailyStats.pendingBalance || 0).toLocaleString()}`}
                                        icon={<Clock size={24} />}
                                        color="bg-yellow-100 text-yellow-600"
                                        delay={0.3}
                                        isLoading={loadingStats}
                                    />
                                </motion.div>

                                {/* Main Graph/Content Area */}
                                <motion.div variants={letterVariants}>
                                    <ChalkMetricsBoard />
                                </motion.div>
                            </div>

                            {/* Notifications Area */}
                            <div className="lg:col-span-4 space-y-6 flex flex-col items-center lg:items-end">
                                {/* Placeholders or real notifications */}
                            </div>
                        </div>
                    )}

                    {/* Operational Actions */}
                    {(hasPermission('folios.create') || hasPermission('calendar.view')) && (
                        <div className="space-y-6">
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                variants={containerVariants}
                            >
                                <DashboardAction
                                    title="Nuevo Pedido"
                                    desc="Crear orden personalizada"
                                    color="from-red-500 to-red-600"
                                    onClick={() => navigate('/folio/nuevo')}
                                    icon={<PlusCircle className="w-8 h-8 text-white" />}
                                />
                                <DashboardAction
                                    title="Ver Calendario"
                                    desc="Consultar fechas de entrega"
                                    color="from-blue-500 to-blue-600"
                                    onClick={() => navigate('/calendario')}
                                    icon={<CalendarIcon className="w-8 h-8 text-white" />}
                                />
                                {hasPermission('users.invite') && (
                                    <>
                                        <DashboardAction
                                            title="Registrar Empleado"
                                            desc="Invitar vía QR"
                                            color="from-amber-600 to-amber-700"
                                            onClick={generateInvite}
                                            icon={<UserPlus className="w-8 h-8 text-white" />}
                                        />
                                        {showQrModal && (
                                            <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQrModal(false)}>
                                                <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                                                    <h3 className="text-2xl font-bold text-gray-800">Escanea para Unirte</h3>
                                                    <p className="text-gray-500 text-sm">Este código vincula al nuevo empleado contigo.</p>
                                                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block">
                                                        {inviteToken && (
                                                            <QRCodeSVG
                                                                value={`${window.location.origin}/register?inviteToken=${inviteToken}`}
                                                                size={200}
                                                                level="H"
                                                                includeMargin={true}
                                                                imageSettings={{
                                                                    src: "/vite.svg",
                                                                    x: undefined,
                                                                    y: undefined,
                                                                    height: 24,
                                                                    width: 24,
                                                                    excavate: true,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400">Válido por 24 horas</p>
                                                    <button onClick={() => setShowQrModal(false)} className="w-full py-3 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200">Cerrar</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>

                            {/* CASH CLOSING */}
                            {(hasPermission('cash.close') || hasPermission('dashboard.view_stats')) && (
                                <motion.div variants={letterVariants}>
                                    <CashClosing />
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Production View */}
                    {hasPermission('production.view') && (
                        <motion.div className="max-w-3xl mx-auto space-y-10" variants={containerVariants}>
                            {/* Mock Data for visual - Should be replaced with real production feed ideally */}
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Producción en Curso</h3>
                            <EmptyState message="No hay órdenes en producción activas en esta vista rápida." subMessage="Revisa el tablero de Kanban completo." />
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

// Sub-components
const StatCard = ({ title, value, icon, color, isLoading }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4 transition-all duration-300"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${color}`}>{icon}</div>
        <div>
            <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mt-1"></div>
            ) : (
                <p className="text-2xl font-black text-gray-800 dark:text-white mt-1">{value}</p>
            )}
        </div>
    </motion.div>
);

const DashboardAction = ({ title, desc, color, onClick, icon }) => (
    <motion.button
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden w-full h-48 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none flex flex-col justify-end p-6 text-left group bg-gradient-to-br ${color}`}
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

export default Dashboard;
