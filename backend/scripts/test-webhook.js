const axios = require('axios');

async function testWebhook() {
    console.log("🚀 Iniciando prueba de Webhook (Simulando WhatsApp Gateway)...");

    const webhookUrl = 'http://localhost:3000/api/webhooks/whatsapp';

    // Payload simulado como lo enviaría whatsapp-gateway.js
    const payload = {
        data: {
            body: "generar folio",
            from: "5218115555555@c.us",
            contactId: "5218115555555@c.us",
            key: { remoteJid: "5218115555555@c.us" },
            conversation: `Cliente: Hola, buenas tardes.
Empleado: Hola, ¿en qué podemos ayudarte?
Cliente: Quiero generar folio para un pastel de chocolate para 20 personas para el sábado.
Empleado: generar folio`
        }
    };

    try {
        console.log(`📤 Enviando POST a ${webhookUrl}...`);
        const response = await axios.post(webhookUrl, payload);
        console.log("✅ Respuesta del servidor:", response.status, response.data);
        console.log("🎉 ¡La prueba fue exitosa! El backend recibió y procesó el mensaje.");
    } catch (error) {
        console.error("❌ Error en la prueba:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
            if (error.response.status === 404) {
                console.error("💡 Tip: Asegúrate de que tu servidor backend esté corriendo (npm run dev).");
            }
        } else {
            console.error(error.message);
            if (error.code === 'ECONNREFUSED') {
                console.error("💡 Tip: El servidor no parece estar corriendo en localhost:3000.");
            }
        }
    }
}

testWebhook();
