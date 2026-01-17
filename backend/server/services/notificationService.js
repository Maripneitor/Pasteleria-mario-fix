const axios = require('axios');

// URL del Gateway Local (el script whatsapp-gateway.js corriendo en puerto 3001)
const GATEWAY_URL = 'http://localhost:3001/send';

/**
 * Servicio para manejar notificaciones (WhatsApp, Email, etc.)
 */
const NotificationService = {

    /**
     * Envía un mensaje de WhatsApp a través del Gateway local.
     * @param {string} phone - Número de teléfono del destinatario.
     * @param {string} message - Texto del mensaje.
     * @param {string|null} mediaUrl - URL de la imagen/archivo a enviar (opcional).
     * @returns {Promise<boolean>} - True si se envió (o se encoló) correctamente.
     */
    async sendWhatsApp(phone, message, mediaUrl = null) {
        if (!phone || !message) {
            console.warn('⚠️ NotificationService: Faltan datos para enviar WhatsApp (phone o message).');
            return false;
        }

        // Lógica "Fire and Forget" para no bloquear el hilo principal
        // No hacemos 'await' del axios.post intencionalmente para la respuesta rápida,
        // PERO capturamos el error en un .catch para logging.
        const payload = { phone, message, mediaUrl };

        console.log(`📤 NotificationService: Enviando WhatsApp a ${phone}...`);

        axios.post(GATEWAY_URL, payload)
            .then(response => {
                console.log(`✅ NotificationService: WhatsApp enviado/encolado. Resp Gateway: ${response.status}`);
            })
            .catch(error => {
                console.error(`❌ NotificationService: Error al contactar whatsapp-gateway en ${GATEWAY_URL}.`);
                if (error.code === 'ECONNREFUSED') {
                    console.error('   -> ¿Está corriendo "node whatsapp-gateway.js"?');
                } else {
                    console.error('   ->', error.message);
                }
            });

        return true; // Asumimos éxito inmediato (async)
    }
};

module.exports = NotificationService;
