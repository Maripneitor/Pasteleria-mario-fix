const OpenAI = require('openai');

let openai;

function getOpenAIClient() {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            // Log warning but don't crash, allow graceful fallback if needed, or throw if strict
            console.warn('⚠️ OPENAI_API_KEY missing. AI features will fail.');
            throw new Error('OPENAI_API_KEY is not set in environment variables.');
        }
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
}

exports.extractOrderDetails = async (text) => {
    try {
        const client = getOpenAIClient();

        const systemPrompt = `
            Eres un experto asistente de recepción de pedidos para una pastelería.
            Tu tarea es extraer información estructurada a partir de un texto informal (mensaje de WhatsApp, nota de voz transcrita, etc.).
            
            Analiza el texto y devuelve SOLAMENTE un objeto JSON válido con la siguiente estructura:
            {
                "clientName": "Nombre del cliente (o 'Cliente' si no se encuentra)",
                "clientPhone": "Número de teléfono (null si no se encuentra)",
                "deliveryDate": "Fecha de entrega en formato YYYY-MM-DD. Si dice 'para el viernes', calcula la fecha próxima. Si no hay fecha, usa null",
                "deliveryTime": "Hora de entrega (ej. '14:00'). Si no hay, null",
                "cakeFlavor": "Sabor del pastel principal (ej. Chocolate, Vainilla).",
                "persons": "Número de personas (integer).",
                "filling": "Relleno (si se menciona).",
                "designDescription": "Descripción del diseño o notas adicionales. Copia el texto relevante tal cual.",
                "shape": "Forma (Redondo, Cuadrado, etc) si se menciona."
            }
            
            Si falta información, intenta inferir lo obvio o déjalo en null/valores por defecto sensatos, pero trata de llenar lo más posible.
            Hoy es: ${new Date().toLocaleDateString('es-MX')}
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3, // Bajo para ser más determinista
        });

        const content = response.choices[0].message.content;
        const jsonResult = JSON.parse(content);

        return jsonResult;

    } catch (error) {
        console.error("❌ Error en AI Extraction Service:", error);
        throw error;
    }
};
