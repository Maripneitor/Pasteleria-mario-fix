import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChalkMetricsBoard from '../components/dashboard/ChalkMetricsBoard';
import Navigation from '../components/Navigation';
import RegisterEmployeeModal from '../components/dashboard/RegisterEmployeeModal';

import CashCloseTicket from '../components/dashboard/CashCloseTicket';
import SealConfigModal from '../components/dashboard/SealConfigModal';

const OwnerDashboard = () => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showCashClose, setShowCashClose] = useState(false);
    const [showSealConfig, setShowSealConfig] = useState(false);

    return (
        <div className="min-h-screen bg-bakery-cream font-sans flex text-gray-800">
            <main className="flex-1 w-full max-w-7xl px-8 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-bakery-text">Panel del Dueño</h1>
                    <p className="text-gray-500">Resumen ejecutivo.</p>
                </header>

                <div className="mb-10">
                    {/* Financial/Metrics Area - Expanded */}
                    <div className="w-full">
                        <h2 className="font-bold text-gray-700 tracking-wider uppercase text-sm mb-2">Finanzas Semanales</h2>
                        <ChalkMetricsBoard
                            salesData={[
                                { name: 'Lun', ventas: 12 },
                                { name: 'Mar', ventas: 19 },
                                { name: 'Mie', ventas: 8 },
                                { name: 'Jue', ventas: 24 },
                                { name: 'Vie', ventas: 35 },
                                { name: 'Sab', ventas: 42 },
                                { name: 'Dom', ventas: 0 },
                            ]}
                            financials={{ expected: 45000, collected: 28500, pending: 16500 }}
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="font-bold text-gray-700 tracking-wider uppercase text-sm mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group"
                        >
                            <div className="font-bold text-bakery-primary group-hover:text-bakery-accent transition-colors">+ Registrar Empleado</div>
                            <div className="text-xs text-gray-400 mt-1">Crear cuenta staff</div>
                        </button>
                        <button
                            onClick={() => setShowCashClose(true)}
                            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group"
                        >
                            <div className="font-bold text-bakery-primary group-hover:text-bakery-accent transition-colors">Cierre de Caja</div>
                            <div className="text-xs text-gray-400 mt-1">Resumen del día</div>
                        </button>
                        <button
                            onClick={() => setShowSealConfig(true)}
                            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group"
                        >
                            <div className="font-bold text-bakery-primary group-hover:text-bakery-accent transition-colors">Configurar Sello</div>
                            <div className="text-xs text-gray-400 mt-1">Personalizar folios</div>
                        </button>
                        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group">
                            <div className="font-bold text-bakery-primary group-hover:text-bakery-accent transition-colors">Ver Reportes</div>
                            <div className="text-xs text-gray-400 mt-1">Exportar PDF mensual</div>
                        </button>
                    </div>
                </div>

                <RegisterEmployeeModal
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                />
                <CashCloseTicket
                    isOpen={showCashClose}
                    onClose={() => setShowCashClose(false)}
                />
                <SealConfigModal
                    isOpen={showSealConfig}
                    onClose={() => setShowSealConfig(false)}
                />

            </main>
        </div>
    );
};

export default OwnerDashboard;
