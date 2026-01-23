import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import folioService from '../services/folioService';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import EmptyState from './EmptyState';
import { sanitizeFolioList } from '../utils/folioSanitizer';
import { useSocket } from '../context/SocketContext';

const COLUMNS = [
    { id: 'Pendiente', title: 'Pendiente', color: 'bg-gray-500' },
    { id: 'Nuevo', title: 'Nuevo', color: 'bg-blue-500' },
    { id: 'En Producción', title: 'En Producción', color: 'bg-yellow-500' },
    { id: 'Listo para Entrega', title: 'Listo', color: 'bg-green-500' },
    { id: 'Entregado', title: 'Entregado', color: 'bg-purple-500' }
];

const KanbanBoard = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        fetchFolios();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = (data) => {
            console.log('🔔 Kanban Update:', data);
            fetchFolios();
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

    const fetchFolios = async () => {
        try {
            const response = await folioService.getAllFolios({ status: '' });
            const foliosData = Array.isArray(response) ? response : (response?.data || []);
            setFolios(sanitizeFolioList(foliosData));
            setLoading(false);
        } catch (err) {
            console.error("Error loading Kanban board:", err);
            setError('Error de conexión con la base de datos de producción.');
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        const folioId = draggableId;

        // 1. Optimistic Update
        const originalFolios = [...folios];
        const folioIndex = folios.findIndex(f => f.id.toString() === folioId.toString());

        if (folioIndex === -1) return;

        const updatedFolios = [...folios];
        updatedFolios[folioIndex] = { ...updatedFolios[folioIndex], status: newStatus };
        setFolios(updatedFolios);

        // 2. API Call
        try {
            await folioService.updateFolioStatus(folioId, { status: newStatus });
            showNotification(`Folio actualizado a ${newStatus}`, 'success');
        } catch (err) {
            setFolios(originalFolios);
            showNotification('Error al actualizar el estado', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-10">{error}</div>
    );

    return (
        <div className="h-full flex flex-col relative">
            <DragDropContext onDragEnd={onDragEnd}>
                {folios.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <EmptyState
                            message="Tablero de Producción Vacío"
                            subMessage="No hay folios activos en este momento."
                        />
                    </div>
                ) : (
                    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50 dark:bg-bakery-950 transition-colors">
                        <div className="flex h-full gap-4 p-4 min-w-max pb-6">
                            {COLUMNS.map(col => (
                                <KanbanColumn
                                    key={col.id}
                                    status={col.id}
                                    title={col.title}
                                    color={col.color}
                                    folios={folios}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
