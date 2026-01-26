export const mockSession = {
    id: 'mock-session-1',
    status: 'active',
    chatHistory: [
        { role: 'assistant', content: 'Hola, soy Don Mario IA. ¿En qué puedo ayudarte hoy?' },
        { role: 'user', content: 'Quiero cotizar un pastel para 20 personas.' }
    ],
    extractedData: {
        clientName: 'Usuario Mock',
        persons: 20
    }
};

export const mockSessionsList = [
    { id: '1', client: 'Juan Perez', lastMessage: 'Gracias', timestamp: '10:00 AM' },
    { id: '2', client: 'Ana Gomez', lastMessage: '¿Precio?', timestamp: '09:45 AM' }
];
