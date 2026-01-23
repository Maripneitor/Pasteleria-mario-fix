import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import InventoryWatch from './production/InventoryWatch';
import folioService from '../services/folioService';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import EmptyState from './EmptyState';
import { sanitizeFolioList } from '../utils/folioSanitizer';

const COLUMNS = [
    { id: 'Pendiente', title: 'Pendiente', color: 'bg-gray-500' },
    { id: 'En Producción', title: 'En Producción (Cocción)', color: 'bg-yellow-500' },
    { id: 'Decorado', title: 'Decorado / Terminado', color: 'bg-purple-500' },
    { id: 'Listo para Entrega', title: 'Listo para Entrega', color: 'bg-green-500' }
];

const KanbanBoard = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchFolios();
    }, []);

    const fetchFolios = async () => {
        try {
            const response = await folioService.getAllFolios({ status: '' });
            const foliosData = Array.isArray(response)
                ? response
                : (response?.data && Array.isArray(response.data) ? response.data : []);

            setFolios(sanitizeFolioList(foliosData));
            setLoading(false);
        } catch (err) {
            console.error("Error loading Kanban board:", err);
            setError('Error al cargar el tablero de producción.');
            setLoading(false);
        }
    };

    const updateLocalStatus = (folioId, newStatus) => {
        const originalFolios = [...folios];
        const folioIndex = folios.findIndex(f => (f.id || f._id || f.folioNumber).toString() === folioId.toString());

        if (folioIndex === -1) return;
        const currentStatus = folios[folioIndex].status;
        if (currentStatus === newStatus) return;

        const updatedFolios = [...folios];
        updatedFolios[folioIndex] = { ...updatedFolios[folioIndex], status: newStatus };
        setFolios(updatedFolios);

        return originalFolios; // Return for rollback
    };

    const commitStatusUpdate = async (folioId, newStatus, originalFolios) => {
        try {
            await folioService.updateFolioStatus(folioId, { status: newStatus });
            showNotification(`Folio movido a ${newStatus}`, 'success');
        } catch (err) {
            setFolios(originalFolios);
            showNotification('Error al actualizar el estado', 'error');
        }
    };

    const handleDrop = async (folioId, newStatus) => {
        const original = updateLocalStatus(folioId, newStatus);
        if (original) commitStatusUpdate(folioId, newStatus, original);
    };

    const handleNextStatus = (folio) => {
        const currentStatus = folio.status;
        const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);

        if (currentIndex !== -1 && currentIndex < COLUMNS.length - 1) {
            const nextStatus = COLUMNS[currentIndex + 1].id;
            const folioId = folio.id || folio._id || folio.folioNumber;
            const original = updateLocalStatus(folioId, nextStatus);
            if (original) commitStatusUpdate(folioId, nextStatus, original);
        } else {
            showNotification('Este pedido ya está en la etapa final', 'info');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Filter active folios for inventory calculation
    const activeForInventory = folios.filter(f => f.status === 'Pendiente' || f.status === 'En Producción');

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-bakery-primary" size={32} />
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-10">{error}</div>
    );

    return (
        <div className="h-full flex flex-col relative space-y-4">
            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-full shadow-lg font-medium text-white ${notification.type === 'success' ? 'bg-green-600' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-600'}`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inventory Projection */}
            <InventoryWatch activeFolios={activeForInventory} />

            {folios.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                    <EmptyState
                        message="Tablero de Producción Vacío"
                        subMessage="No hay pedidos activos."
                    />
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50 dark:bg-bakery-950 transition-colors rounded-xl border border-gray-200 dark:border-slate-800">
                    <div className="flex h-full gap-4 p-4 min-w-max pb-6">
                        {COLUMNS.map(col => (
                            <KanbanColumn
                                key={col.id}
                                status={col.id}
                                title={col.title}
                                color={col.color}
                                folios={folios}
                                onDrop={handleDrop}
                                onNextStatus={handleNextStatus}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
