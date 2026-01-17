// scripts/test-ai-extraction.js
const { getInitialExtraction } = require('../server/services/aiExtractorService');

// Mockear OpenAI
const mockResponse = {
    folioType: 'Normal',
    clientName: 'Juan Pérez',
    persons: 20,
    deliveryDate: '2023-12-25',
    cakeFlavor: ['Chocolate'],
    filling: ['Fresa'],
    total: 500
};

// Interceptamos la llamada real (simulación simple, en un test real usaríamos Jest/Sinon)
// Para este script rápido, vamos a intentar ejecutarlo y ver si falla por falta de API Key o DB, 
// lo cual nos dirá si las dependencias están bien cargadas.

async function runTest() {
    console.log("🧪 Iniciando prueba de AiExtractorService...");

    // Como no queremos gastar cuota ni requerir la key real para este test básico de INTEGRACIÓN de tipos:
    // Vamos a validar que la función exista y que el archivo se pueda importar sin errores de sintaxis.

    if (typeof getInitialExtraction !== 'function') {
        console.error("❌ Error: getInitialExtraction no es una función.");
        process.exit(1);
    }

    console.log("✅ getInitialExtraction importada correctamente.");

    // Validar estructura de mockResponse contra lo que esperamos (simulacro)
    const requiredKeys = ['folioType', 'persons', 'deliveryDate'];
    const missing = requiredKeys.filter(k => !mockResponse[k]);

    if (missing.length > 0) {
        console.error("❌ El mock de prueba está incompleto (simulación de fallo de IA).");
    } else {
        console.log("✅ Estructura de datos esperada validada.");
    }

    console.log("ℹ️ Nota: Para una prueba completa offline, se requeriría mocking avanzado de la librería 'openai'.");
    console.log("🎉 Prueba estática exitosa.");
}

runTest();
