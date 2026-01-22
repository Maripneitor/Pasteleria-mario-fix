const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

module.exports = function (req, res, next) {
  let token;
  const authHeader = req.header('Authorization');

  // 1. Intentamos obtener el token del encabezado 'Authorization'
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2. Fallback: Query params (ej. PDF links)
  else if (req.query.token) {
    token = req.query.token;
  }

  // 3. Validación inicial de existencia
  if (!token) {
    return apiResponse(res, 401, 'Acceso denegado. No se proporcionó un token.', null, "AUTH_REQUIRED");
  }

  try {
    // 4. Verificación del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Inyectar usuario en request
    req.user = decoded;

    next();
  } catch (error) {
    // Manejo específico de errores JWT
    if (error.name === 'TokenExpiredError') {
      return apiResponse(res, 401, 'Sesión expirada. Por favor inicie sesión nuevamente.', null, "TOKEN_EXPIRED");
    }

    if (error.name === 'JsonWebTokenError') {
      return apiResponse(res, 401, 'Token inválido o corrupto.', null, "TOKEN_INVALID");
    }

    console.error("Error validando token:", error);
    return apiResponse(res, 500, 'Error interno validando la sesión.', null, "AUTH_ERROR");
  }
};