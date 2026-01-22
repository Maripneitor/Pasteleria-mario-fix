const jwt = require('jsonwebtoken');
const { User, UserBranchMembership, Role, Permission } = require('../models');
const apiResponse = require('../utils/apiResponse');

// 1. Validar JWT e inyectar usuario
const authMiddleware = (req, res, next) => {
  let token;
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) return apiResponse(res, 401, 'Token no proporcionado.', null, "AUTH_REQUIRED");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contiene id, email, etc.
    next();
  } catch (error) {
    return apiResponse(res, 401, 'Token inválido o expirado.', null, "TOKEN_INVALID");
  }
};

// 2. Validar pertenencia a Sucursal (Multi-tenancy)
const requireBranchMembership = async (req, res, next) => {
  const branchId = req.header('X-Branch-ID');
  if (!branchId) return apiResponse(res, 400, 'Contexto de sucursal (X-Branch-ID) requerido.', null, "BRANCH_REQUIRED");

  try {
    const membership = await UserBranchMembership.findOne({
      where: { user_id: req.user.id, branch_id: branchId }
    });

    if (!membership) return apiResponse(res, 403, 'No perteneces a esta sucursal.', null, "FORBIDDEN_BRANCH");

    req.tenant = { branchId: parseInt(branchId, 10) };
    next();
  } catch (error) {
    return apiResponse(res, 500, 'Error validando sucursal.');
  }
};

// 3. Validar Permiso (RBAC)
const checkPermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      // Buscamos si el usuario tiene un rol con ese permiso en esta sucursal
      // Esta lógica asume que las tablas roles/permissions están pobladas
      const hasPermission = await User.findOne({
        where: { id: req.user.id },
        include: [{
          model: Role,
          as: 'roles',
          where: { branch_id: req.tenant.branchId },
          include: [{
            model: Permission,
            as: 'permissions',
            where: { code: permissionCode }
          }]
        }]
      });

      if (!hasPermission) return apiResponse(res, 403, `Permiso insuficiente: ${permissionCode}`, null, "INSUFFICIENT_PERMISSIONS");
      next();
    } catch (error) {
      return apiResponse(res, 500, 'Error validando permisos.');
    }
  };
};

module.exports = { authMiddleware, requireBranchMembership, checkPermission };