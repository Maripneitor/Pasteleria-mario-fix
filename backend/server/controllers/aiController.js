const aiExtractionService = require('../services/aiExtractionService');

// Extracción Real con OpenAI
exports.extractFolioFromText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Se requiere texto para procesar." });
        }

        console.log("🤖 AI Extraction Start (Real):", text.substring(0, 50) + "...");

        const extractedData = await aiExtractionService.extractOrderDetails(text);

        console.log("🤖 AI Extraction Result:", extractedData);

        res.status(200).json(extractedData);

    } catch (error) {
        console.error("Error en AI Extraction Controller:", error);
        res.status(500).json({
            message: "Error procesando el texto con IA.",
            error: error.message
        });
    }
};
