const { User, UserBranchMembership, UserRole, Role, Permission, Branch } = require('../models');

/**
 * Middleware factory to check if a user has a specific permission.
 * It assumes a previous middleware (like JWT auth) has populated req.user.
 * 
 * It also checks or sets the current Branch context:
 * - Ideally, the client sends 'X-Branch-ID' header.
 * - If not, we try to infer it or require it.
 * 
 * @param {string} permissionCode - The code of the permission to check (e.g. 'folios.create')
 */
const checkPermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: No user found' });
      }

      const branchIdProp = req.headers['x-branch-id'] || req.body.branchId || req.query.branchId;

      // If the permission is global (like 'organizations.create'), we might not need a branch.
      // But for this system context, most logic is branch-scoped.

      let branchId = branchIdProp ? parseInt(branchIdProp) : null;

      // 1. Fetch User Roles and Permissions
      // We need to see if the user has a Role that grants this Permission,
      // AND if that Role is assigned to the user for the current Branch (or is Global).

      const userRoles = await UserRole.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Role,
            include: [{
              model: Permission,
              as: 'permissions',
              where: { code: permissionCode }
            }]
          }
        ]
      });

      // Filter roles that are valid for the context
      // A role is valid if:
      // - Role scope is 'Global'
      // - OR Role scope is 'Branch' AND UserRole.branchId matches current branchId

      const hasValidRole = userRoles.some(ur => {
        const role = ur.Role;
        if (!role) return false;

        // Check if role actually has the permission (inner join should ensure this but just in case)
        const hasPerm = role.permissions && role.permissions.length > 0;
        if (!hasPerm) return false;

        if (role.scope === 'Global') return true;

        if (role.scope === 'Branch') {
          // If scope is branch, we MUST have a branchId in request context 
          // AND the assignment must match that branch.
          if (!branchId) return false;
          return ur.branchId === branchId;
        }

        return false;
      });

      if (hasValidRole) {
        // Attach branchId to req for controllers to use
        if (branchId) req.branchId = branchId;
        return next();
      }

      return res.status(403).json({
        message: `Forbidden: You do not have the required permission '${permissionCode}'`
      });

    } catch (error) {
      console.error('RBAC Error:', error);
      return res.status(500).json({ message: 'Internal Server Error during authorization' });
    }
  };
};

/**
 * Middleware to verify simple membership to a branch.
 * Does not check granular permissions, just if they are "inside" the branch.
 */
const requireBranchMembership = async (req, res, next) => {
  try {
    const branchId = req.headers['x-branch-id'] || req.body.branchId || req.query.branchId;

    if (!branchId) {
      return res.status(400).json({ message: 'Branch ID is required (X-Branch-ID header)' });
    }

    const membership = await UserBranchMembership.findOne({
      where: {
        userId: req.user.id,
        branchId: branchId
      }
    });

    if (!membership) {
      return res.status(403).json({ message: 'Access Denied: You are not a member of this branch' });
    }

    req.branchId = parseInt(branchId);
    req.membership = membership;
    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error checking membership' });
  }
};

module.exports = {
  checkPermission,
  requireBranchMembership
};