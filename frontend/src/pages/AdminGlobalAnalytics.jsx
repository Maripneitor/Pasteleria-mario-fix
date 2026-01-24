import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import api from '../api/axios';

const AdminGlobalAnalytics = () => {
    // Mock Data for now as we build the UI
    const salesData = [
        { name: 'Sucursal Centro', ventas: 40000, folios: 24 },
        { name: 'Sucursal Norte', ventas: 30000, folios: 18 },
        { name: 'Franquicia A', ventas: 20000, folios: 9 },
        { name: 'Franquicia B', ventas: 27800, folios: 14 },
    ];

    const healthData = [
        { name: 'Normal', value: 95 },
        { name: 'Errores', value: 5 },
    ];

    const COLORS = ['#4ade80', '#ef4444'];

    return (
        <div className="p-6 min-h-screen bg-[#2e2e2e] text-gray-100 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                <TrendingUp className="text-blue-400" />
                Tablero Global de Administración
            </h1>

            {/* Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Users size={18} /> Total Usuarios
                    </div>
                    <div className="text-4xl font-bold text-white">124</div>
                </div>
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <Activity size={18} /> Folios Hoy
                    </div>
                    <div className="text-4xl font-bold text-green-400">42</div>
                </div>
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <TrendingUp size={18} /> Ventas Mes
                    </div>
                    <div className="text-4xl font-bold text-blue-400">$128k</div>
                </div>
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                        <AlertTriangle size={18} /> Errores SQL
                    </div>
                    <div className="text-4xl font-bold text-red-400">3</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Ranking de Ventas */}
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-gray-200">Rendimiento por Sucursal</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                                <XAxis dataKey="name" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#222', borderColor: '#555', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="ventas" fill="#60a5fa" name="Ventas ($)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="folios" fill="#34d399" name="Folios (#)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Salud del Sistema */}
                <div className="bg-[#3e3e3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-gray-200">Salud del Sistema (Hoy)</h2>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={healthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#555' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminGlobalAnalytics;
