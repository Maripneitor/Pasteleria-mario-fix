import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Plus, Search, DollarSign, Truck } from 'lucide-react';
import { Card } from '../../ui/Card';
import { useNavigate } from 'react-router-dom';

const EmployeeWidgets = ({ orders }) => {
    const navigate = useNavigate();

    // Mock Logic for Shift Summary
    const pendingCount = orders?.filter(o => o.status === 'Pendiente').length || 0;
    const completedCount = orders?.filter(o => o.status === 'Entregado').length || 0;

    const ActionButton = ({ label, icon: Icon, color, onClick, delay }) => (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full"
        >
            <Card className={`h-32 ${color} text-white flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all p-4 border-none`}>
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Icon size={32} />
                </div>
                <span className="font-bold text-lg">{label}</span>
            </Card>
        </motion.button>
    );

    return (
        <div className="space-y-6">
            {/* Shift Summary Section */}
            <h2 className="text-2xl font-bold text-text-primary px-1 font-serif tracking-tight">Tu Turno Hoy</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pending Tasks */}
                <Card glass className="p-6 border-l-4 border-l-yellow-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-text-primary">{pendingCount}</div>
                            <div className="text-sm text-text-secondary">Pendientes</div>
                        </div>
                    </div>
                </Card>

                {/* Completed Tasks */}
                <Card glass className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-text-primary">{completedCount}</div>
                            <div className="text-sm text-text-secondary">Entregados</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Giant Action Buttons Grid */}
            <h2 className="text-2xl font-bold text-text-primary px-1 mt-8 font-serif tracking-tight">Accesos Rápidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <ActionButton
                    label="Nuevo Pedido"
                    icon={Plus}
                    color="bg-gradient-to-br from-brand-primary to-rose-600"
                    onClick={() => navigate('/folio/nuevo')}
                    delay={0.1}
                />
                <ActionButton
                    label="Consultar Folio"
                    icon={Search}
                    color="bg-gradient-to-br from-blue-500 to-indigo-600"
                    onClick={() => navigate('/folios')}
                    delay={0.2}
                />
                <ActionButton
                    label="Entrega Rápida"
                    icon={Truck}
                    color="bg-gradient-to-br from-teal-500 to-emerald-600"
                    onClick={() => navigate('/folios')}
                    delay={0.3}
                />
                <ActionButton
                    label="Corte de Caja"
                    icon={DollarSign}
                    color="bg-gradient-to-br from-slate-600 to-slate-800"
                    onClick={() => alert('Próximamente')}
                    delay={0.4}
                />
            </div>
        </div>
    );
};

export default EmployeeWidgets;
