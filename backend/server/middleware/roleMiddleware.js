const apiResponse = require('../utils/apiResponse');
const LoggerService = require('../services/loggerService');

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      if (!req.user) {
        await LoggerService.security('Auth', 'Intento de acceso sin usuario autenticado en ruta protegida', {
          path: req.originalUrl,
          ip: req.ip
        });
        return apiResponse(res, 401, 'Usuario no autenticado.', null, "AUTH_REQUIRED");
      }

      const userRole = req.user.role ? req.user.role.toLowerCase() : 'unknown';
      const allowedRoles = roles.map(r => r.toLowerCase());

      if (roles.length && !allowedRoles.includes(userRole)) {
        await LoggerService.security('AccessControl', `Acceso denegado: Rol '${userRole}' intentó acceder a recurso protegido`, {
          requiredRoles: allowedRoles,
          userId: req.user.id,
          path: req.originalUrl
        });
        return apiResponse(res, 403, 'No tienes permiso para realizar esta acción.', null, "ACCESS_DENIED");
      }

      next();
    } catch (error) {
      console.error("Error en middleware de autorización:", error);
      return apiResponse(res, 500, 'Error interno de autorización.');
    }
  };
}

module.exports = authorize;