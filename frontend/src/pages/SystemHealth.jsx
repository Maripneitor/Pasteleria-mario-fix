import React, { useEffect, useState } from 'react';
import TechScrollContainer from '../components/dashboard/TechScrollContainer';
import dashboardService from '../services/dashboard.service';

const SystemHealth = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        dashboardService.getDeveloperMetrics().then(setMetrics).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-8">
            <h1 className="text-3xl mb-6 border-b border-green-800 pb-2">SYSTEM_HEALTH_DEBUGGER</h1>

            <div className="grid gap-6">
                <TechScrollContainer>
                    <h3 className="text-xl mb-4 text-green-300">RAW METRICS DUMP</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(metrics, null, 2)}
                    </pre>
                </TechScrollContainer>

                <div className="p-4 border border-red-900 bg-red-900/10 rounded">
                    <h3 className="text-red-500 font-bold">DANGER ZONE</h3>
                    <button className="mt-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors pointer-events-none opacity-50">
                        FLUSH REDIS CACHE (Disabled)
                    </button>
                    <button className="mt-2 ml-4 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors pointer-events-none opacity-50">
                        RESTART NODE SERVICE (Disabled)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
