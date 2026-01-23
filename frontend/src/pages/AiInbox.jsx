import React from 'react';
import AiInboxComponent from '../components/orders/AiInbox';
import folioService from '../services/folioService';
import { useNavigate } from 'react-router-dom';

const AiInbox = () => {
    const navigate = useNavigate();

    const handleOrderCreated = async (extractedData) => {
        // Here we could directly create the order or navigate to NewFolio with pre-filled data.
        // For standard UX, let's navigate to NewFolio with state.
        navigate('/folio/nuevo', { state: { prefilledData: extractedData } });
    };

    return (
        <div className="space-y-6">
            <header className="mb-6">
                <h1 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">Asistente IA</h1>
                <p className="text-gray-500 dark:text-gray-400">Procesa pedidos desde WhatsApp automáticamente.</p>
            </header>

            <AiInboxComponent onOrderCreated={handleOrderCreated} />
        </div>
    );
};

export default AiInbox;
