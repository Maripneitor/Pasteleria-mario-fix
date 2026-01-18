import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TechScrollContainer from '../components/dashboard/TechScrollContainer';
import dashboardService from '../services/dashboard.service';

const DeveloperDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getDeveloperMetrics();
                setMetrics(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Polling faster for "real-time" feel
        return () => clearInterval(interval);
    }, []);

    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-0.5 text-xs font-bold border rounded ${status === 'Connected' ? 'border-green-500 text-green-400 bg-green-900/20' :
            'border-red-500 text-red-400 bg-red-900/20'
            }`}>
            {status?.toUpperCase() || 'UNKNOWN'}
        </span>
    );

    return (
        <div className="min-h-full bg-[#0a0a0a] text-green-500 font-mono p-4 md:p-8 rounded-xl shadow-2xl">
            <header className="mb-8 flex justify-between items-end border-b border-green-900/50 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tighter text-green-400 text-shadow-glow">SYSTEM_MONITOR_V1</h1>
                    <p className="text-xs text-green-700 mt-1">:: ROOT ACCESS GRANTED ::</p>
                </div>
                <div className="text-right text-xs text-green-800">
                    UPTIME: {metrics ? Math.floor(metrics.system.uptime / 60) + 'm' : '...'}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {/* System Resources */}
                <TechScrollContainer className="h-full min-h-[250px] flex flex-col">
                    <h3 className="text-lg mb-4 border-b border-green-800/50 pb-2"> [ CORE RESOURCES ] </h3>
                    <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-center">
                            <span>HEAP TOTAL</span>
                            <span className="text-green-300">{metrics?.system.memory.heapTotal || '...'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>HEAP USED</span>
                            <span className="text-green-300">{metrics?.system.memory.heapUsed || '...'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>RSS</span>
                            <span className="text-green-300">{metrics?.system.memory.rss || '...'}</span>
                        </div>
                    </div>
                </TechScrollContainer>

                {/* Database Status */}
                <TechScrollContainer className="h-full min-h-[250px] flex flex-col">
                    <h3 className="text-lg mb-4 border-b border-green-800/50 pb-2"> [ DB_CONNECTION ] </h3>
                    <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-center">
                            <span>STATUS</span>
                            <StatusBadge status={metrics?.database.status} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>LATENCY</span>
                            <span className="text-green-300">{metrics?.database.latency} ms</span>
                        </div>
                        <div className="mt-6 border-t border-green-900/30 pt-4">
                            <div className="flex justify-between items-center text-red-400">
                                <span>ERROR_COUNT_SESSION</span>
                                <span className="text-xl font-bold">{metrics?.errors.count || 0}</span>
                            </div>
                        </div>
                    </div>
                </TechScrollContainer>

                {/* Network Latency Graph */}
                <TechScrollContainer className="md:col-span-2 h-[350px] flex flex-col">
                    <h3 className="text-lg mb-4 border-b border-green-800/50 pb-2"> [ NETWORK_LATENCY_HISTORY ] </h3>
                    <div className="flex-1 w-full min-h-0">
                        {metrics?.latencyHistory && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.latencyHistory}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis stroke="#15803d" fontSize={10} tickFormatter={(v) => `${v}ms`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#15803d', color: '#4ade80' }}
                                        itemStyle={{ color: '#4ade80' }}
                                    />
                                    <Line
                                        type="step"
                                        dataKey="latency"
                                        stroke="#4ade80"
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </TechScrollContainer>
            </div>
        </div>
    );
};

export default DeveloperDashboard;
