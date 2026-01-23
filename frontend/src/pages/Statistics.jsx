import React, { useEffect, useState } from 'react';
import { BarChart, TrendingUp, DollarSign, Award, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'; // [RECHARTS]
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8'];

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useSocket();

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/folios/statistics');
            setStats(response.data);
        } catch (err) {
            console.error("Error loading statistics:", err);
            setError("No se pudieron cargar las estadísticas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => {
            console.log('🔔 Statistics Update Received');
            fetchStatistics();
        };
        socket.on('folio:created', handleUpdate);
        socket.on('folio:updated', handleUpdate);
        socket.on('folio:deleted', handleUpdate);
        return () => {
            socket.off('folio:created', handleUpdate);
            socket.off('folio:updated', handleUpdate);
            socket.off('folio:deleted', handleUpdate);
        };
    }, [socket]);

    // Data Transformation for Recharts
    const trendData = stats?.ordersTrend?.map((val, i) => ({
        day: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i] || `Día ${i + 1}`,
        orders: val
    })) || [];

    const pieData = stats?.topFlavors?.map(f => ({
        name: f.name,
        value: f.count
    })) || [];

    if (loading) return <div className="p-10 text-center text-gray-500 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!stats) return <div className="p-10 text-center text-gray-500">No hay datos disponibles.</div>;

    return (
        <div className="p-6 bg-bakery-cream min-h-screen">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-serif font-bold text-bakery-text flex items-center gap-3">
                    <BarChart className="text-bakery-accent" />
                    Estadísticas de Negocio
                </h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200">
                        <Calendar size={18} />
                        Esta Semana
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg shadow-sm font-medium text-white hover:bg-indigo-700">
                        <Download size={18} />
                        Exportar
                    </button>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Venta Mensual</p>
                        <h3 className="text-3xl font-bold text-gray-800">${stats.revenue?.monthly?.toLocaleString() || '0'}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <DollarSign size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Crecimiento</p>
                        <h3 className={`text-3xl font-bold ${stats.revenue?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.revenue?.growth >= 0 ? '+' : ''}{stats.revenue?.growth || 0}%
                        </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <TrendingUp size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Top Venta</p>
                        <h3 className="text-xl font-bold text-gray-800 truncate max-w-[150px]" title={stats.topFlavors?.[0]?.name}>{stats.topFlavors?.[0]?.name || 'N/A'}</h3>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                        <Award size={28} />
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Tendencia de Pedidos (7 Días)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Flavors Donut Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Distribución de Sabores</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '10px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{pieData.reduce((acc, curr) => acc + curr.value, 0)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
