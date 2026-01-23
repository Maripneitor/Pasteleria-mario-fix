import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastSystem'; // Import useToast

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const [socket, setSocket] = useState(null);
    const { showSuccess, showProduction, showError } = useToast(); // Use toast

    useEffect(() => {
        if (user && token) {
            const branchId = user.branchId || localStorage.getItem('branch_id');
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

            const newSocket = io(socketUrl, {
                query: { branchId },
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
            });

            console.log('🔌 Connecting to Socket.io...');

            newSocket.on('connect', () => {
                console.log('✅ Connected to Socket.io');
            });

            newSocket.on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err);
            });

            // Global Notification Handlers
            newSocket.on('folio:created', (data) => {
                showSuccess(`Nuevo pedido #${data.folioNumber || data.id} registrado.`);
            });

            newSocket.on('folio:updated', (data) => {
                if (data.status === 'En Producción' || data.status === 'Producción') {
                    showProduction(`Pedido #${data.folioNumber} pasó a Producción.`);
                } else if (data.status === 'Listo' || data.status === 'Listo para Entrega') {
                    showSuccess(`Pedido #${data.folioNumber} está listo para entregar.`);
                }
            });

            setSocket(newSocket);

            return () => {
                console.log('🔌 Disconnecting Socket.io...');
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user, token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
