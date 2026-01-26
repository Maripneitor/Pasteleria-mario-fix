import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import InventoryWatch from './production/InventoryWatch';
// import folioService from '../services/folioService'; // Deprecated for local Sync
import { useToast } from '../context/ToastSystem';
import { Loader2 } from 'lucide-react';
import EmptyState from './EmptyState';
import GlassCard from './ui/GlassCard';
import { useOrderSync } from '../context/OrderSyncContext'; // Import Sync Context

const COLUMNS = [
    { id: 'Pendiente', title: 'Pendiente', color: 'bg-gray-500' },
    { id: 'En Producción', title: 'En Producción (Cocción)', color: 'bg-yellow-500' },
    { id: 'Decorado', title: 'Decorado / Terminado', color: 'bg-purple-500' },
    { id: 'Listo para Entrega', title: 'Listo para Entrega', color: 'bg-green-500' }
];

const KanbanBoard = () => {
    // Consume Global Sync Context
    const { orders: folios, updateOrderStatus } = useOrderSync();

    // const [folios, setFolios] = useState([]); // Managed by Context
    const [loading, setLoading] = useState(false); // Data is instant from context
    // const [error, setError] = useState(null);
    // const { showSuccess, showError, showInfo } = useToast(); 

    // Legacy fetch removed in favor of SyncContext

    /* 
       We simplified the logic: 
       KanbanBoard now just renders `folios` from context.
       `updateLocalStatus` and `commitStatusUpdate` are replaced by `updateOrderStatus` from context.
    */

    const handleDrop = (folioId, newStatus) => {
        // handle Type coercion if needed
        updateOrderStatus(Number(folioId), newStatus);
    };

    const handleNextStatus = (folio) => {
        const currentStatus = folio.status;
        const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);

        if (currentIndex !== -1 && currentIndex < COLUMNS.length - 1) {
            const nextStatus = COLUMNS[currentIndex + 1].id;
            updateOrderStatus(folio.id, nextStatus);
        }
    };

    // ... rest of component ...




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
                <GlassCard className="flex-1 overflow-x-auto overflow-y-hidden border border-border p-0">
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
                </GlassCard>
            )}
        </div>
    );
};

export default KanbanBoard;
