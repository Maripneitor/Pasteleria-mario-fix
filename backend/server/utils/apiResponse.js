/**
 * Estándar de respuesta para la API
 * @param {Response} res - Objeto de respuesta de Express
 * @param {number} status - Código de estado HTTP
 * @param {string} message - Mensaje descriptivo
 * @param {object|null} data - Datos de la respuesta
 * @param {string|null} code - Código de error interno (opcional)
 */
const apiResponse = (res, status, message, data = null, code = null) => {
    const payload = {
        success: status >= 200 && status < 300,
        message,
        data,
        timestamp: new Date().toISOString()
    };

    if (code) {
        payload.code = code;
    }

    return res.status(status).json(payload);
};

module.exports = apiResponse;
