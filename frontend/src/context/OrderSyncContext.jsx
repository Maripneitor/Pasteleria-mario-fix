import React, { createContext, useContext, useEffect, useState } from 'react';

const OrderSyncContext = createContext();

export const useOrderSync = () => useContext(OrderSyncContext);

const CHANNEL_NAME = 'kitchen_channel';
const STORAGE_KEY = 'kds_orders';

// Initial Mock Data (If storage is empty)
const INITIAL_ORDERS = [
    { id: 1700000000001, folioNumber: '1024', cakeFlavor: 'Chocolate Oscuro', decoration: 'Feliz Cumpleaños Ana', deliveryTime: '14:00', urgency: 'critical', notes: 'Alérgico a nueces', status: 'Pendiente' },
    { id: 1700000000002, folioNumber: '1025', cakeFlavor: 'Tres Leches Vainilla', decoration: 'Logo Empresa', deliveryTime: '16:30', urgency: 'high', notes: '', status: 'Pendiente' },
    { id: 1700000000003, folioNumber: '1026', cakeFlavor: 'Red Velvet', decoration: 'Sencillo', deliveryTime: '18:00', urgency: 'normal', notes: '', status: 'Pendiente' },
];

export const OrderSyncProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        try {
            return stored ? JSON.parse(stored) : INITIAL_ORDERS;
        } catch {
            return INITIAL_ORDERS;
        }
    });

    const [channel, setChannel] = useState(null);

    // Initialize BroadcastChannel
    useEffect(() => {
        const bc = new BroadcastChannel(CHANNEL_NAME);
        setChannel(bc);

        bc.onmessage = (event) => {
            if (event.data && event.data.type === 'SYNC_ORDERS') {
                setOrders(event.data.payload);
            }
        };

        return () => bc.close();
    }, []);

    // Persist to LocalStorage whenever orders change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }, [orders]);

    // Broadcast helper
    const broadcastUpdate = (newOrders) => {
        if (channel) {
            channel.postMessage({ type: 'SYNC_ORDERS', payload: newOrders });
        }
    };

    // Actions
    const addOrder = (order) => {
        setOrders(prev => {
            const updated = [...prev, order];
            broadcastUpdate(updated);
            return updated;
        });
    };

    const updateOrderStatus = (id, newStatus) => {
        setOrders(prev => {
            const updated = prev.map(o => o.id === id ? { ...o, status: newStatus } : o);
            // If completed/removed, we might want to filter, but for now we keep status update logic flexible
            // For KDS 'Complete', we usually filter it out locally in the view, or mark as 'Completed'
            // Let's assume KDS 'Complete' means changing status to 'Listo para Entrega' or 'Terminado'
            broadcastUpdate(updated);
            return updated;
        });
    };

    const deleteOrder = (id) => {
        setOrders(prev => {
            const updated = prev.filter(o => o.id !== id);
            broadcastUpdate(updated);
            return updated;
        });
    };

    // Simulation Logic (Optional: Centralized simulation)
    // We can expose a method to trigger simulation manually or have a centralized simulator component

    return (
        <OrderSyncContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderSyncContext.Provider>
    );
};
