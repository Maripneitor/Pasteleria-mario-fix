const { addDays, format } = require('date-fns');

// Simulación de IA usando RegEx y lógica simple
exports.extractFolioFromText = async (req, res) => {
    try {
        const { text, additionalContext } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Se requiere texto para procesar." });
        }

        console.log("🤖 AI Extraction Start:", text.substring(0, 50) + "...");

        // Estructura de Salida
        const extractedData = {
            clientName: "Cliente Identificado",
            deliveryDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // Mañana por defecto
            deliveryTime: "12:00",
            cakeFlavor: "Vainilla",
            persons: "20",
            designDescription: text,
            filling: "Fresa"
        };

        // --- LOGICA DE EXTRACCION MOCK/REGEX ---

        // 1. Detectar Personas (ej. "20 personas", "para 15")
        const personsMatch = text.match(/(\d+)\s*(personas|pax|pers)/i);
        if (personsMatch) extractedData.persons = personsMatch[1];

        // 2. Detectar Sabor (ej. "chocolate", "vainilla")
        if (text.match(/chocolate/i)) extractedData.cakeFlavor = "Chocolate";
        if (text.match(/vainilla/i)) extractedData.cakeFlavor = "Vainilla";
        if (text.match(/red velvet/i)) extractedData.cakeFlavor = "Red Velvet";
        if (text.match(/tres leches/i)) extractedData.cakeFlavor = "Tres Leches";

        // 3. Detectar Nombre (muy básico, post "para")
        const nameMatch = text.match(/para\s+([A-Z][a-z]+)/);
        if (nameMatch) extractedData.clientName = nameMatch[1];

        console.log("🤖 AI Extraction Result:", extractedData);

        res.status(200).json(extractedData);

    } catch (error) {
        console.error("Error en AI Extraction:", error);
        res.status(500).json({ message: "Error procesando el texto." });
    }
};
