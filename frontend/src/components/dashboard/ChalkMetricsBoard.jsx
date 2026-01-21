import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import BakerRanking from './BakerRanking';

const MetricCard = ({ label, value, prefix = '', subtitle }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
        <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</h4>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && <span className="text-xs text-green-500 font-medium mt-1">{subtitle}</span>}
    </div>
);

const ChalkMetricsBoard = ({ salesData, financials, bakers }) => {
    // Default empty if loading or error
    const data = salesData || [];
    // financials: { expected, collected, pending }
    const { expected = 0, collected = 0, pending = 0 } = financials || {};

    // Calculate productivity or percentage collected
    const collectionRate = expected > 0 ? Math.round((collected / expected) * 100) : 0;

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Financials */}
                <div className="lg:col-span-3 flex flex-col space-y-4">
                    <MetricCard value={pending} label="Por Cobrar" prefix="$" />
                    <MetricCard value={collected} label="Cobrado" prefix="$" />
                    <MetricCard value={`${collectionRate}%`} label="Recaudación" subtitle="Meta: 90%" />
                </div>

                {/* Middle Column: Weekly Sales Chart */}
                <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Ventas Semanales</h3>
                    <ResponsiveContainer width="100%" height="300px">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="name"
                                stroke="#64748B"
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#64748B"
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#F1F5F9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="ventas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Right Column: Baker Ranking */}
                <div className="lg:col-span-3">
                    <BakerRanking bakers={bakers} />
                </div>
            </div>
        </div>
    );
};

export default ChalkMetricsBoard;
