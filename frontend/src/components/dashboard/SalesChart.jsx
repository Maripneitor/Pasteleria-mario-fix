import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';

const SalesChart = ({ data }) => {
    // Mock data if none provided
    const chartData = data || [
        { name: 'Lun', sales: 4000 },
        { name: 'Mar', sales: 3000 },
        { name: 'Mie', sales: 2000 },
        { name: 'Jue', sales: 2780 },
        { name: 'Vie', sales: 1890 },
        { name: 'Sab', sales: 2390 },
        { name: 'Dom', sales: 3490 },
    ];

    return (
        <GlassCard className="h-96">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Tendencia de Ingresos</h3>
            <div className="h-full w-full pb-8">
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E31C79" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#E31C79" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                            labelStyle={{ color: '#6B7280' }}
                            formatter={(value) => [`$${value}`, 'Ventas']}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#E31C79"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default SalesChart;
