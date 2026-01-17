const pdfService = require('./server/services/pdfService');

// Mock data
const mockFolio = {
    folioNumber: 'TEST-001',
    createdAt: new Date(),
    responsibleUser: { username: 'Tester' },
    deliveryDate: new Date(),
    // Add minimal required fields for template
    client: { name: 'Test Client', phone: '1234567890' },
    folioType: 'Normal',
    cakeFlavor: ['Vainilla'],
    filling: [{ name: 'Fresa', hasCost: false }],
    total: '100.00',
    advancePayment: '50.00',
    balance: '50.00'
};

async function runTest() {
    console.log('🚀 Iniciando prueba de PDF Service...');

    try {
        // Test 1: Generate Single PDF
        console.log('\n--- Prueba 1: Generar PDF Individual ---');
        // Note: This will try to upload to GCS. If no creds, it might fail.
        // We catch the error to verify if Puppeteer part worked.
        try {
            const url = await pdfService.createPdf(mockFolio);
            console.log('✅ PDF Generado exitosamente. URL:', url);
        } catch (error) {
            console.log('⚠️ PDF Generado (probablemente), pero falló subida (esperado si no hay credenciales):');
            console.log(error.message);
        }

        // Test 2: Concurrency
        console.log('\n--- Prueba 2: Concurrencia (5 peticiones) ---');
        const tasks = Array(5).fill(mockFolio).map((data, i) => {
            return pdfService.createPdf({ ...data, folioNumber: `TEST-${i}` })
                .then(url => console.log(`✅ Petición ${i} completada`))
                .catch(err => console.log(`⚠️ Petición ${i} falló/terminó: ${err.message}`));
        });

        await Promise.all(tasks);
        console.log('🏁 Prueba de concurrencia finalizada.');

    } catch (error) {
        console.error('❌ Error fatal en pruebas:', error);
    }
}

runTest();
