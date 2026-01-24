const { sequelize } = require('../config/database');
const User = require('./user');
const Client = require('./client');
const Folio = require('./Folio');
const FolioEditHistory = require('./FolioEditHistory');
const Commission = require('./Commission');
const AISession = require('./AISession');
const Flavor = require('./Flavor');
const Filling = require('./Filling');
const SystemLog = require('./SystemLog');

// --- NUEVOS MODELOS RBAC ---
const Organization = require('./Organization');
const Branch = require('./Branch');
const UserBranchMembership = require('./UserBranchMembership');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');
const Payment = require('./Payment');
const FolioStatusHistory = require('./FolioStatusHistory');
const FolioNote = require('./FolioNote');
const FolioAttachment = require('./FolioAttachment');
const FolioHistory = require('./FolioHistory');


// --- ASOCIACIONES RBAC ---
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });
UserRole.belongsTo(Branch, { foreignKey: 'branch_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

// --- ASOCIACIONES DE TENANCY ---
Branch.hasMany(Client, { foreignKey: 'branch_id' });
Client.belongsTo(Branch, { foreignKey: 'branch_id' });
Branch.hasMany(Folio, { foreignKey: 'branch_id' });
Folio.belongsTo(Branch, { foreignKey: 'branch_id' });

// --- OTRAS RELACIONES ---
User.hasMany(Folio, { foreignKey: 'responsibleUserId' });
Folio.belongsTo(User, { as: 'responsibleUser', foreignKey: 'responsibleUserId' });
Client.hasMany(Folio, { foreignKey: 'clientId' });
Folio.belongsTo(Client, { as: 'client', foreignKey: 'clientId' });

module.exports = {
  sequelize, User, Client, Folio, FolioEditHistory, Commission, AISession, Flavor, Filling, SystemLog,
  Organization, Branch, UserBranchMembership, Role, Permission, RolePermission, UserRole,
  Payment, FolioStatusHistory, FolioNote, FolioAttachment, FolioHistory
};