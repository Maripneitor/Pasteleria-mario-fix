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
// 2. Validar pertenencia a Sucursal (Multi-tenancy)
const requireBranchMembership = async (req, res, next) => {
  // SEGURIDAD: Validar que req.user exista antes de seguir
  if (!req.user || !req.user.id) {
    return apiResponse(res, 401, 'Sesión no válida para validar sucursal.', null, "AUTH_MISSING");
  }

  const branchId = req.header('X-Branch-ID');

  // MODIFICACION: Permitir acceso Global a Admins/Dueños sin branchId
  // Si no hay branchId y es admin, permitimos pasar pero req.tenant será undefined.
  // Los controladores deben saber manejar req.tenant undefined (modo global).
  const isGlobalAdmin = req.user && ['Administrador', 'Dueño'].includes(req.user.role);

  if (!branchId) {
    if (isGlobalAdmin) {
      console.log(`🌍 Acceso Global permitido para ${req.user.username} (${req.user.role})`);
      return next();
    }
    return apiResponse(res, 400, 'Contexto de sucursal (X-Branch-ID) requerido.', null, "BRANCH_REQUIRED");
  }

  try {
    const { UserBranchMembership } = require('../models');
    // Si es global admin, ¿debe validar membresía?
    // Técnicamente el admin tiene acceso a todo. 
    // Si envía un ID, validamos que exista la branch, pero no necesariamente la "membresía" en tabla (si es superadmin).
    // Por consistencia, asumimos que si envía ID, quiere actuar COMO esa sucursal.

    // Bypass de membresía para admins si se desea (opcional, pero seguro):
    if (!isGlobalAdmin) {
      const membership = await UserBranchMembership.findOne({
        where: { user_id: req.user.id, branch_id: branchId }
      });
      if (!membership) return apiResponse(res, 403, 'No perteneces a esta sucursal.', null, "FORBIDDEN_BRANCH");
    }

    req.tenant = { branchId: parseInt(branchId, 10) };
    next();
  } catch (error) {
    return apiResponse(res, 500, 'Error validando sucursal.');
  }
};

// 3. Validar Permiso (RBAC)
// 3. Validar Permiso (RBAC)
const checkPermission = (permissionCode) => {
  return async (req, res, next) => {
    // SEGURIDAD: Validar que req.user y req.tenant existan
    if (!req.user || !req.user.id) {
      return apiResponse(res, 401, 'Usuario no identificado.', null, "AUTH_REQUIRED");
    }
    // Fix: isGlobalAdmin checks standardized names
    const isGlobalAdmin = req.user && ['Administrador', 'Dueño'].includes(req.user.role);

    // Bypass if Global Admin/Owner doesn't have a tenant context (operating globally)
    if (!req.tenant && isGlobalAdmin) {
      // Check if they have the role globally in DB (optional strict check)
      // For now, trust the token + role check for purely Global operations (like accessing dashboard of all branches)
      // However, we should still try to find if they have the permission if it's a granular permission check.
      // Only "Super Admins" should bypass everything.
      if (req.user.role === 'Administrador') return next();
    }

    if (!req.tenant && !isGlobalAdmin) {
      return apiResponse(res, 400, 'Falta contexto de sucursal.', null, "TENANT_REQUIRED");
    }

    try {
      const { UserRole, Role, Permission } = require('../models');

      const whereClause = { user_id: req.user.id };
      // If we have a tenant, filter by it. If not (and we are here), we handle global or fail.
      if (req.tenant && req.tenant.branchId) {
        whereClause.branch_id = req.tenant.branchId;
      } else if (isGlobalAdmin) {
        // Global admins can be checked with branch_id = null or we assume they have global role
        // But the query below expects a match. 
        // If Role scope is 'Global', branch_id in UserRole might be NULL.
        whereClause.branch_id = null;
      }

      // Special case: If Global Admin acts on a specific branch, they might not have a direct UserRole row 
      // for that branch if their role is Global.
      // We should check if they have a GLOBAL role that grants this permission.

      // Strategy: Check if user has the permission strictly in the context OR has a Global role with the permission.

      const userHasPermission = await UserRole.findOne({
        where: { user_id: req.user.id },
        include: [{
          model: Role,
          required: true,
          where: {
            // Role must either match the branch specific logic OR be a Global role
          },
          include: [{
            model: Permission,
            as: 'permissions',
            where: { code: permissionCode }
          }]
        }]
      });

      // Filter logic in Javascript to handle the OR condition (Global role vs Branch role) more easily than complex Sequelize ORs mixed with Includes
      // Actually, let's simplify:
      // An Admin (Global) should have a UserRole with role_id=1 (Administrador) and branch_id=NULL.
      // An Owner (Branch) should have UserRole with role_id=2 and branch_id=X.

      // If I am an Admin accessing Branch X, I want to pass if I have Global Role.
      // So verify if I have the permission via ANY role that covers this context.

      const validRoles = await UserRole.findAll({
        where: { user_id: req.user.id },
        include: [{
          model: Role,
          include: [{ model: Permission, as: 'permissions', where: { code: permissionCode } }]
        }]
      });

      const hasAccess = validRoles.some(ur => {
        // Validation for orphan records
        if (!ur.Role) {
          console.warn(`⚠️ ALERTA DE INTEGRIDAD: UserRole encontrado sin Role asociado para usuario ${req.user.id}`);
          return false;
        }

        // If Role is Global, it grants access everywhere
        if (ur.Role.scope === 'Global') return true;
        // If Role is Branch, it must match the requested tenant
        if (ur.Role.scope === 'Branch' && req.tenant && ur.branch_id === req.tenant.branchId) return true;
        return false;
      });

      if (!hasAccess) {
        // Fallback: If user is strictly 'Administrador' by string token, allow? 
        // Safer to rely on DB, but if DB is desynced, this fails. 
        // User requested: "Si un rol es Global... no filtre obligatoriamente por branch_id."
        if (req.user.role === 'Administrador') return next();

        return apiResponse(res, 403, `Permiso insuficiente: ${permissionCode}`, null, "FORBIDDEN");
      }
      next();
    } catch (error) {
      console.error('❌ Error RBAC:', error);
      return apiResponse(res, 500, 'Error de validación interna.');
    }
  };
};

module.exports = { authMiddleware, requireBranchMembership, checkPermission };