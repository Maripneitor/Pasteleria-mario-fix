// import api from './api';

const extractOrderDetails = async (text) => {
    try {
        // Prepare payload
        // const payload = { text };

        // Call backend (Assuming endpoint exists)
        // const response = await api.post('/ai/extract', payload);
        // return response.data;

        // MOCK RESPONSE for Demo/Frontend Dev
        // Simulating 1.5s delay of AI processing
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockExtraction = {
                    clientName: "Usuario WhatsApp",
                    clientPhone: "555-123-4567",
                    cakeFlavor: "Chocolate",
                    filling: "Fresa",
                    designDescription: text,
                    deliveryDate: new Date().toISOString().split('T')[0], // Today
                    deliveryTime: "14:00"
                };

                // Simple keyword extraction simulation
                if (text.toLowerCase().includes("vainilla")) mockExtraction.cakeFlavor = "Vainilla";
                if (text.toLowerCase().includes("tres leches")) mockExtraction.cakeFlavor = "Tres Leches";
                if (text.toLowerCase().includes("juan")) mockExtraction.clientName = "Juan Pérez";

                resolve(mockExtraction);
            }, 1500);
        });

    } catch (error) {
        console.error("AI Extraction Error:", error);
        throw error;
    }
};

export default {
    extractOrderDetails
};
